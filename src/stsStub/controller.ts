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

const WALLET_SUBJECT_ID = "walletSubjectIdPlaceholder";

export async function stsStubController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const grantType = req.body["grant_type"];
    const preAuthorizedCode = req.body["pre-authorized_code"];

    const isGrantTypeValid = validateGrantType(grantType);
    const payload = getPreAuthorizedCodePayload(preAuthorizedCode);

    if (!isGrantTypeValid || !payload) {
      return res.status(400).json({ error: "invalid_grant" });
    }

    console.log({
      message: `Valid pre-authorized code received: ${preAuthorizedCode}`,
    });

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
    console.log(`An error happened: ${JSON.stringify(error)}`);
    return res.status(500).json({ error: "server_error" });
  }
}
