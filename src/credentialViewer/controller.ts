import { Request, Response } from "express";
import { isAuthenticated } from "../utils/isAuthenticated";
import { decodeJwt } from "jose";
import axios from "axios";
import { getCriEndpoint, getSelfUrl } from "../config/appConfig";
import { GrantType } from "../stsStubAccessToken/token/validateTokenRequest";
import { logger } from "../middleware/logger";
import { decode as decodeCbor, getEncoded, Tag } from "cbor2";
import { base64UrlDecoder } from "../utils/base64Encoder";
import { Sign1 } from "@auth0/cose";
import { replaceMapsWithObjects } from "../utils/replaceMapsWithObjects";
import { X509Certificate } from "node:crypto";

// utility to automatically/recursively decode bstr values tagged 24 which are themselves encoded CBOR
Tag.registerDecoder(24, ({ contents }) => {
  return decodeCbor(contents as Buffer);
});

export async function credentialViewerController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const preAuthorizedCode = extractPreAuthCode(req.query.offer as string);

    let preAuthorizedCodeClaims = undefined;
    try {
      preAuthorizedCodeClaims = decodeJwt(preAuthorizedCode);
    } catch (error) {
      logger.error(error, "An error occurred decoding the preAuthorizedCode");
    }

    const accessToken = await getAccessToken(preAuthorizedCode);

    let accessTokenClaims = undefined;
    try {
      accessTokenClaims = decodeJwt(accessToken);
    } catch (error) {
      logger.error(error, "An error occurred decoding the accessTokenClaims");
    }

    let proofJwt = "";
    let proofJwtClaims = undefined;
    if (accessTokenClaims) {
      try {
        proofJwt = await getProofJwt(
          accessTokenClaims.c_nonce as string,
          accessTokenClaims.aud as string,
        );
      } catch (error) {
        logger.error(error, "An error occurred getting the proofJwt");
      }
      try {
        proofJwtClaims = decodeJwt(proofJwt);
      } catch (error) {
        logger.error(error, "An error occurred decoding the proofJwtClaims");
      }
    }

    const credential = await getCredential(accessToken, proofJwt);
    let credentialClaims = undefined;
    let credentialSignature: Sign1 | undefined = undefined;
    let credentialSignaturePayload = undefined;
    let credentialClaimsTitle = "";
    let x5chain = "";
    let x5chainHex = "";

    if (attemptToDecodeAsJwt(credential)) {
      // attempt to decode as JWT
      try {
        credentialClaims = decodeJwt(credential);
        credentialClaimsTitle = "VCDM credential";
        logger.info("Decoded JWT credential");
      } catch (error) {
        logger.error(
          error,
          "An error occurred whilst decoding a JWT credential",
        );
      }
    } else {
      // attempt to decode as CBOR
      try {
        credentialClaimsTitle = "mdoc Credential";
        ({ credentialClaims, credentialSignature, credentialSignaturePayload } =
          decodeMDocCredential(credential));

        try {
          ({ x5chain, x5chainHex } = decodeX5Chain(credentialSignature));
        } catch (error) {
          x5chain = "An error occurred decoding the x5chain element in the MSO";
          logger.info(
            error,
            "An error occurred decoding the x5chain element in the MSO",
          );
        }

        logger.info("Decoded CBOR credential");
      } catch (error) {
        logger.error(
          error,
          "An error occurred whilst decoding a CBOR credential",
        );
      }
    }

    res.render("credential.njk", {
      authenticated: isAuthenticated(req),
      preAuthorizedCode,
      preAuthorizedCodeClaims: JSON.stringify(preAuthorizedCodeClaims, null, 2),
      accessToken,
      accessTokenClaims: JSON.stringify(accessTokenClaims, null, 2),
      proofJwt,
      proofJwtClaims: JSON.stringify(proofJwtClaims, null, 2),
      credential,
      credentialClaimsTitle,
      credentialClaims: JSON.stringify(
        credentialClaims,
        replaceMapsWithObjects,
      ),
      credentialSignature: JSON.stringify(
        credentialSignature,
        replaceMapsWithObjects,
      ),
      credentialSignaturePayload: JSON.stringify(
        credentialSignaturePayload,
        replaceMapsWithObjects,
      ),
      x5chain,
      x5chainHex,
    });
  } catch (error) {
    logger.error(error, "An error happened.");
    res.render("500.njk");
  }
}

// as a crude way to determine whether the credential may be JWT or CBOR:
// - if it begins 'eyJ' attempt to decode it as a JWT
// - if it does not begin 'eyJ' attempt to decode it as CBOR
// this function could be improved
function attemptToDecodeAsJwt(jwt: string) {
  return jwt.startsWith("eyJ");
}

function decodeMDocCredential(credential: string) {
  const credentialClaims = decodeCbor(base64UrlDecoder(credential), {
    saveOriginal: true,
  });
  // @ts-expect-error credential is known
  const rawMso = credentialClaims.issuerAuth;
  const credentialSignature = Sign1.decode(getEncoded(rawMso)!);
  const credentialSignaturePayload = decodeCbor(
    Buffer.from(credentialSignature.payload),
  );

  return {
    credentialClaims,
    credentialSignature,
    credentialSignaturePayload,
  };
}

function decodeX5Chain(credentialSignature: Sign1) {
  // Element 33 in the UnprotectedHeaders map is the x5chain.
  // There must be at least one certificate. If there is more then this is an array of certificates
  const x5chainBuffer = credentialSignature.unprotectedHeaders.get(33);

  const x5chainHex = (x5chainBuffer as Buffer).toString("hex");
  let x5chain = "";
  let x5chainCerts: Buffer[];
  if (Array.isArray(x5chainBuffer)) {
    x5chainCerts = x5chainBuffer;
  } else {
    x5chainCerts = [x5chainBuffer as Buffer];
  }
  x5chainCerts.forEach((certificate) => {
    const x5cert = new X509Certificate(certificate);
    x5chain = x5cert.toString() + "\n";
  });
  return {
    x5chain,
    x5chainHex,
  };
}

function extractPreAuthCode(credentialOfferUri: string) {
  const credentialOfferString = credentialOfferUri.split(
    "add?credential_offer=",
  )[1];
  const credentialOffer = JSON.parse(credentialOfferString);
  return credentialOffer.grants[
    "urn:ietf:params:oauth:grant-type:pre-authorized_code"
  ]["pre-authorized_code"];
}

export async function getAccessToken(
  preAuthorizedCode: string,
): Promise<string> {
  const response = await axios.post(
    `${getSelfUrl()}/token`,
    {
      grant_type: GrantType.PREAUTHORIZED_CODE,
      "pre-authorized_code": preAuthorizedCode,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  return response.data.access_token;
}

export async function getProofJwt(
  c_nonce: string,
  audience: string,
): Promise<string> {
  const proofJwtResponse = await axios.get(
    `${getSelfUrl()}/proof-jwt?nonce=${c_nonce}&audience=${audience}`,
  );
  return proofJwtResponse.data.proofJwt;
}

export async function getCredential(
  accessToken: string,
  proofJwt: string,
): Promise<string> {
  const criUrl = getCriEndpoint();
  const credentialUrl = criUrl + "/credential";

  const response = await axios.post(
    credentialUrl,
    {
      proof: {
        proof_type: "jwt",
        jwt: proofJwt,
      },
    },
    {
      headers: {
        Authorization: `BEARER ${accessToken}`,
      },
    },
  );
  return response.data.credentials[0].credential;
}
