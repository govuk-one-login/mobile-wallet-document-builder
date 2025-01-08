import {Request, Response} from "express";
import {logger} from "../middleware/logger";
import {isAuthenticated} from "../utils/isAuthenticated";
import {decodeJwt} from "jose";
import axios from "axios";
import {getCriEndpoint, getSelfUrl} from "../config/appConfig";
import {GrantType} from "../stsStubAccessToken/token/validateTokenRequest";

export async function credentialViewerController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const preAuthorizedCode = extractPreAuthCode(req.query.offer as string);

    const accessToken = await getAccessToken(preAuthorizedCode);

    const tokenClaims = decodeJwt(accessToken);

    const proofJwt = await getProofJwt(
      tokenClaims.c_nonce as string,
      tokenClaims.aud as string
    );

    const credential = await getCredential(accessToken, proofJwt);

    const credentialClaims = decodeJwt(credential);

    res.render("credential.njk", {
      authenticated: isAuthenticated(req),
      preAuthorizedCode,
      credential,
      credentialClaims: JSON.stringify(credentialClaims),
      accessToken,
      tokenClaims: JSON.stringify(tokenClaims),
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened processing credential offer request"
    );
    res.render("500.njk");
  }
}

function extractPreAuthCode(credentialOfferUri: string) {
  const credentialOfferString = credentialOfferUri.split("add?credential_offer=")[1]
  const credentialOffer = JSON.parse(credentialOfferString)
  return credentialOffer.grants["urn:ietf:params:oauth:grant-type:pre-authorized_code"]["pre-authorized_code"];
}

export async function getAccessToken(
  preAuthorizedCode: string
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
    }
  );
  return response.data.access_token;
}

export async function getProofJwt(
  c_nonce: string,
  audience: string
): Promise<string> {
  const proofJwtResponse = await axios.get(
    `${getSelfUrl()}/proof-jwt?nonce=${c_nonce}&audience=${audience}`
  );
  return proofJwtResponse.data.proofJwt;
}

const CREDENTIAL_PATH = "/credential";

export async function getCredential(
  accessToken: string,
  proofJwt: string
): Promise<string> {
  try {
    const criUrl = getCriEndpoint();
    const credentialUrl = criUrl + CREDENTIAL_PATH;

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
      }
    );

    logger.info(`Fetched credential with accessToken ${accessToken}`);

    return response.data.credential;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Error fetching credential with accessToken ${accessToken}`);
      logger.error(error);
    } else {
      logger.error(
        `Unexpected error happened fetching credential with accessToken ${accessToken}`
      );
    }
    throw error;
  }
}