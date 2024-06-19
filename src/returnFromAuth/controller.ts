import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { TokenSet } from "openid-client";
import { getCookieExpiry } from "../utils/getCookieExpiry";
import { buildClientAssertion } from "./clientAssertion/buildClientAssertion";
import { getClientSigningKeyId } from "../config/appConfig";
import {Jwt} from "../types/Jwt";

export async function returnFromAuthGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (req.query.error) {
      logger.error(`${req.query.error} - ${req.query.error_description}`);
      res.status(500);
    }

    const clientAssertion: Jwt = await buildClientAssertion(
      req.oidc.metadata.client_id!,
      req.oidc.issuer.metadata.token_endpoint!,
      getClientSigningKeyId()
    );

    // Exchange the access code in the url parameters for an access token
    const tokenSet: TokenSet = await req.oidc.callback(
      req.oidc.metadata.redirect_uris![0],
      req.oidc.callbackParams(req), // Get all parameters to pass to the token exchange endpoint
      { nonce: req.cookies.nonce, state: req.cookies.state },
      {
        exchangeBody: {
          client_assertion_type:
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          client_assertion: clientAssertion,
        },
      }
    );

    if (!tokenSet.access_token) {
      logger.error("No access token received");
      res.status(500);
    }

    if (!tokenSet.id_token) {
      logger.error("No id token received");
      res.status(500);
    }

    res.cookie("access_token", tokenSet.access_token, {
      httpOnly: true,
      maxAge: getCookieExpiry(),
    });
    res.cookie("id_token", tokenSet.id_token, {
      httpOnly: true,
      maxAge: getCookieExpiry(),
    });

    res.redirect(`/select-document`);
  } catch (error) {
    logger.error(error, "An error happened returning from auth");
    res.render("500.njk");
  }
}
