import { Request, Response } from "express";
import { isAuthenticated } from "../utils/isAuthenticated";
import { decodeJwt, errors } from "jose";
import axios from "axios";
import { getCriEndpoint, getSelfUrl } from "../config/appConfig";
import { GrantType } from "../stsStubAccessToken/token/validateTokenRequest";
import { logger } from "../middleware/logger";
import {decode, getEncoded, Tag} from "cbor2";
import { base64UrlDecoder } from "../utils/base64Encoder";
import {Sign1} from "@auth0/cose";

// utility to automatically/recursively decode bstr values tagged 24 which are themselves encoded CBOR
Tag.registerDecoder(24, ({contents}) => {
  return decode(contents as Buffer);
})

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

    const credential = await getCredential(accessToken, proofJwt);
    logger.info(`Credential ${credential}`);
    let credentialClaims = null;
    let credentialSignature = null;
    let credentialSignaturePayload = null;
    try {
      const payload = {
        decoded: decodeJwt(credential),
      };
      logger.info(payload, "Decoded JWT credential");
      credentialClaims = JSON.stringify(payload.decoded);
    } catch (error) {
      logger.error(error, "Could not decode JWT credential - attempting CBOR decode");
      if (error instanceof errors.JWTInvalid) {
        logger.info("Attempting CBOR decode")
        try {
          credentialClaims = decode(base64UrlDecoder(credential), {
            saveOriginal: true,
          })
          // @ts-expect-error credential is known
          const rawMso = credentialClaims.issuerAuth
          // TODO: document[0] should be replaced by a mechanism which searches for docType: "org.iso.18013.5.1.mDL"
          credentialSignature = Sign1.decode(getEncoded(rawMso)!)
          credentialSignaturePayload = decode(Buffer.from(credentialSignature.payload))
          logger.info({
            credentialClaims,
            rawMso,
            credentialSignature,
            credentialSignaturePayload,
          }, "CREDENTIAL OUTPUT FROM CBOR DECODING")
        } catch (error) {
          logger.error(error, "An error occurred with JWT and/or CBOR decoding")
        }
      } else {
        logger.error(error, "An error occurred with JWT decoding")
      }
    }

    res.render("credential.njk", {
      authenticated: isAuthenticated(req),
      preAuthorizedCode,
      accessToken,
      accessTokenClaims: JSON.stringify(accessTokenClaims),
      proofJwt,
      credential,
      credentialClaims: {
        data: credentialClaims,
        showAllAsClosed: true,
        sortPropertyNames: false,
        fileDroppingEnabled: false,
        // allowEditing: {
        //   booleanValues: false,
        //   decimalValues: false,
        //   numberValues: false,
        //
        // }
      },
      credentialSignature: {
        data: credentialSignature,
        showAllAsClosed: true,
        sortPropertyNames: false,
        fileDroppingEnabled: false,
        // allowEditing: {
        //   booleanValues: false,
        //   decimalValues: false,
        //   numberValues: false,
        //
        // }
      },
      credentialSignaturePayload: {
        data: credentialSignaturePayload,
        showAllAsClosed: true,
        sortPropertyNames: false,
        fileDroppingEnabled: false,
        // allowEditing: {
        //   booleanValues: false,
        //   decimalValues: false,
        //   numberValues: false,
        //
        // }
      },

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
