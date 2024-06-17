import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { CallbackParamsType, TokenSet } from "openid-client";

export async function returnFromAuthGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const queryParams: CallbackParamsType = req.oidc.callbackParams(req);
    if (queryParams.error) {
      logger.error(`${req.query.error} - ${req.query.error_description}`);
      if (queryParams.error === "access_denied") {
        res.status(403);
      }
      res.status(500);
    }

    const tokenResponse: TokenSet = await req.oidc.callback(
      req.oidc.metadata.redirect_uris![0],
      queryParams,
      { nonce: req.cookies.nonce, state: req.cookies.state }
    );

    res.cookie("access_token", tokenResponse.access_token, {
      httpOnly: true,
    });
    res.cookie("id_token", tokenResponse.id_token, {
      httpOnly: true,
    });

    res.redirect(`/select-document`);
  } catch (error) {
    logger.error(error, "An error happened returning from auth");
    res.render("500.njk");
  }
}
