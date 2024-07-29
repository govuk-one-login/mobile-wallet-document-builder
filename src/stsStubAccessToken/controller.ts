import { Request, Response } from "express";
import { getJwtAccessToken } from "./token/accessToken";
import {
  validateGrantType,
  getPreAuthorizedCodePayload,
} from "./token/validateTokenRequest";
import {
  getAccessTokenTtlInSecs,
  getHardcodedWalletSubjectId,
  getStsSigningKeyId,
} from "../config/appConfig";
import { logger } from "../middleware/logger";
import { PREAUTHORIZED_CODE_ERRORS } from "./types/PreAuthorizedCodeErrors";

export async function stsStubAccessTokenController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const grantType = req.body["grant_type"];
    const preAuthorizedCode = req.body["pre-authorized_code"];

    // check if pre-authorized code should trigger an error
    const preAuthorizedCodeErrors = Object.entries(PREAUTHORIZED_CODE_ERRORS);
    for (const [key, value] of preAuthorizedCodeErrors) {
      if (preAuthorizedCode === key) {
        logger.error(`Error pre-authorized code: ${preAuthorizedCode}`);
        return res.status(value.statusCode).json(value.message);
      }
    }

    const isGrantTypeValid = validateGrantType(grantType);
    const payload = getPreAuthorizedCodePayload(preAuthorizedCode);

    if (!isGrantTypeValid || !payload) {
      return res.status(400).json({ error: "invalid_grant" });
    }

    logger.info(`Valid pre-authorized code received: ${preAuthorizedCode}`);

    const accessToken = await getJwtAccessToken(
      getHardcodedWalletSubjectId(),
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
