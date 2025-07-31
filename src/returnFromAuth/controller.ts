import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { TokenSet } from "openid-client";
import { buildClientAssertion } from "./clientAssertion/buildClientAssertion";
import { getClientSigningKeyId, getCookieExpiry } from "../config/appConfig";
import { Jwt } from "../types/Jwt";

/**
 * Handles the OAuth callback from the authorization server.
 *
 * This controller processes the authorization code received from the authorization server,
 * exchanges it for access and ID tokens, and sets cookies for the user session.
 *
 * @param req - Express request object containing OAuth callback parameters
 * @param res - Express response object for sending the response
 * @returns Promise<void>
 */
export async function returnFromAuthGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Handle OAuth error responses from the authorization server
    if (req.query.error) {
      logger.error("OAuth authorization failed", {
        error: req.query.error,
        error_description: req.query.error_description,
      });
      res.render("500.njk");
      return;
    }

    // Build JWT assertion for client authentication
    const clientAssertion: Jwt = await buildClientAssertion(
      req.oidc.metadata.client_id,
      req.oidc.issuer.metadata.token_endpoint!,
      getClientSigningKeyId(),
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
      },
    );

    const cookieOptions = {
      httpOnly: true,
      maxAge: getCookieExpiry(),
    };
    res.cookie("access_token", tokenSet.access_token, cookieOptions);
    res.cookie("id_token", tokenSet.id_token, cookieOptions);

    res.redirect(`/select-document`);
  } catch (error) {
    logger.error("OAuth callback processing failed", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.render("500.njk");
    return;
  }
}
