import { Request, Response } from "express";
import { getJwtAccessToken } from "./token/accessToken";
import {
  validateGrantType,
  getPreAuthorizedCodePayload,
} from "./token/validateTokenRequest";
import {
  getAccessTokenTtlInSecs,
  getStsSigningKeyId,
} from "../config/appConfig";
import { logger } from "../utils/logger";
import { PREAUTHORIZED_CODE_ERRORS } from "./types/PreAuthorizedCodeErrors";

const WALLET_SUBJECT_ID = "walletSubjectIdPlaceholder";

export async function stsStubAccessTokenController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const grantType = req.body["grant_type"];
    const preAuthorizedCode = req.body["pre-authorized_code"];

    const preAuthCodeErrors = Object.entries(PREAUTHORIZED_CODE_ERRORS);
    // check if pre-auth code should trigger an error
    for (const [error, errorValues] of preAuthCodeErrors) {
      if (preAuthorizedCode === error) {
        logger.error(`Error pre-authorized code: ${preAuthorizedCode}`);
        return res.status(errorValues.statusCode).json(errorValues.message);
      }
    }

    const isGrantTypeValid = validateGrantType(grantType);
    const payload = getPreAuthorizedCodePayload(preAuthorizedCode);

    if (!isGrantTypeValid || !payload) {
      return res.status(400).json({ error: "invalid_grant" });
    }

    logger.info(`Valid pre-authorized code received: ${preAuthorizedCode}`);

    const accessToken = await getJwtAccessToken(
      WALLET_SUBJECT_ID,
      payload,
      getStsSigningKeyId()
    );

    return res.status(200).json({
      access_token: accessToken,
      token_type: "bearer",
      expires_in: Number(getAccessTokenTtlInSecs()),
    });
  } catch (error) {
    logger.error(error, "An error happened creating the access token");
    return res.status(500).json({ error: "server_error" });
  }
}
