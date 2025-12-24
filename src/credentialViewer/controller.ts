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

    const accessToken = await getAccessToken(preAuthorizedCode);
    const accessTokenClaims = decodeJwt(accessToken);

    const proofJwt = await getProofJwt(
      accessTokenClaims.c_nonce as string,
      accessTokenClaims.aud as string,
    );

    const proofJwtClaims = JSON.stringify(decodeJwt(proofJwt), null, 2);

    const credential = await getCredential(accessToken, proofJwt);
    logger.info(`Credential ${credential}`);
    let credentialClaims = undefined;
    let credentialSignature = undefined;
    let credentialSignaturePayload = undefined;
    let credentialClaimsTitle = "";

    // as a crude way to determine whether the credential may be JWT or CBOR:
    // - if it begins 'eyJ' attempt to decode it as a JWT
    // - if it does not begin 'eyJ' attempt to decode it as CBOR

    if (credential.startsWith("eyJ") !== null) {
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
        credentialClaims = decodeCbor(base64UrlDecoder(credential), {
          saveOriginal: true,
        });
        credentialClaimsTitle = "mdoc Credential";
        // @ts-expect-error credential is known
        const rawMso = credentialClaims.issuerAuth;
        credentialSignature = Sign1.decode(getEncoded(rawMso)!);
        credentialSignaturePayload = decodeCbor(
          Buffer.from(credentialSignature.payload),
        );
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
      accessToken,
      accessTokenClaims: JSON.stringify(accessTokenClaims, null, 2),
      proofJwt,
      proofJwtClaims,
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
    });
  } catch (error) {
    logger.error(error, "An error happened.");
    res.render("500.njk");
  }
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
