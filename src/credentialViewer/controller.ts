import { Request, Response } from "express";
import { isAuthenticated } from "../utils/isAuthenticated";
import { decodeJwt, JWTPayload } from "jose";
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

interface AccessTokenClaims extends JWTPayload {
  c_nonce?: string;
  aud?: string;
}

interface CredentialData {
  credentialClaims: unknown;
  credentialSignature?: Sign1;
  credentialSignaturePayload?: unknown;
  credentialClaimsTitle: string;
  x5chain: string;
  x5chainHex: string;
}

interface ProofData {
  proofJwt: string;
  proofJwtClaims: JWTPayload | undefined;
}

function safeDecodeJwt(token: string, errorMessage: string): JWTPayload | undefined {
  try {
    return decodeJwt(token);
  } catch (error) {
    logger.error(error, errorMessage);
    return undefined;
  }
}

async function getProofData(accessTokenClaims: JWTPayload | undefined): Promise<ProofData> {
  if (!accessTokenClaims) return { proofJwt: "", proofJwtClaims: undefined };
  
  const claims = accessTokenClaims as AccessTokenClaims;
  if (!claims.c_nonce || !claims.aud) {
    return { proofJwt: "", proofJwtClaims: undefined };
  }
  
  try {
    const proofJwt = await getProofJwt(claims.c_nonce, claims.aud);
    const proofJwtClaims = safeDecodeJwt(proofJwt, "An error occurred decoding the proofJwtClaims");
    return { proofJwt, proofJwtClaims };
  } catch (error) {
    logger.error(error, "An error occurred getting the proofJwt");
    return { proofJwt: "", proofJwtClaims: undefined };
  }
}

function decodeCredentialAsJwt(credential: string): CredentialData {
  const credentialClaims = safeDecodeJwt(credential, "An error occurred whilst decoding a JWT credential");
  if (credentialClaims) logger.info("Decoded JWT credential");
  
  return {
    credentialClaims,
    credentialClaimsTitle: "VCDM credential",
    x5chain: "",
    x5chainHex: ""
  };
}

function decodeCredentialAsCbor(credential: string): CredentialData {
  try {
    const { credentialClaims, credentialSignature, credentialSignaturePayload } = decodeMDocCredential(credential);
    
    let x5chain = "";
    let x5chainHex = "";
    try {
      ({ x5chain, x5chainHex } = decodeX5Chain(credentialSignature));
    } catch (error) {
      x5chain = "An error occurred decoding the x5chain element in the MSO";
      logger.info(error, "An error occurred decoding the x5chain element in the MSO");
    }
    
    logger.info("Decoded CBOR credential");
    return {
      credentialClaims,
      credentialSignature,
      credentialSignaturePayload,
      credentialClaimsTitle: "mdoc Credential",
      x5chain,
      x5chainHex
    };
  } catch (error) {
    logger.error(error, "An error occurred whilst decoding a CBOR credential");
    return {
      credentialClaims: undefined,
      credentialClaimsTitle: "mdoc Credential",
      x5chain: "",
      x5chainHex: ""
    };
  }
}

function processCredential(credential: string): CredentialData {
  return attemptToDecodeAsJwt(credential) 
    ? decodeCredentialAsJwt(credential)
    : decodeCredentialAsCbor(credential);
}

export async function credentialViewerController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const preAuthorizedCode = extractPreAuthCode(req.query.offer as string);
    const preAuthorizedCodeClaims = safeDecodeJwt(preAuthorizedCode, "An error occurred decoding the preAuthorizedCode");
    
    const accessToken = await getAccessToken(preAuthorizedCode);
    const accessTokenClaims = safeDecodeJwt(accessToken, "An error occurred decoding the accessTokenClaims");
    
    const { proofJwt, proofJwtClaims } = await getProofData(accessTokenClaims);
    
    const credential = await getCredential(accessToken, proofJwt);
    const credentialData = processCredential(credential);

    res.render("credential.njk", {
      authenticated: isAuthenticated(req),
      preAuthorizedCode,
      preAuthorizedCodeClaims: preAuthorizedCodeClaims,
      accessToken,
      accessTokenClaims: accessTokenClaims,
      proofJwt,
      proofJwtClaims: proofJwtClaims,
      credential,
      credentialClaimsTitle: credentialData.credentialClaimsTitle,
      credentialClaims: JSON.stringify(credentialData.credentialClaims, replaceMapsWithObjects),
      credentialSignature: JSON.stringify(credentialData.credentialSignature, replaceMapsWithObjects),
      credentialSignaturePayload: JSON.stringify(credentialData.credentialSignaturePayload, replaceMapsWithObjects),
      x5chain: credentialData.x5chain,
      x5chainHex: credentialData.x5chainHex,
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
