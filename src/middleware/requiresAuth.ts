import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";
import { getSelfUrl, getCookieExpiryInMilliseconds } from "../config/appConfig";
import { generators } from "openid-client";

const VECTORS_OF_TRUST = `["Cl"]`;

export function requiresAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const isAuthenticated = req.cookies["id_token"];
  const selectedApp = req.cookies["app"];

  logger.info(
    `isAuthenticated = ${isAuthenticated} , selectedApp = ${selectedApp}`,
  );

  if (isAuthenticated === undefined) {
    redirectToLogIn(req, res);
  } else {
    next();
  }
}

export function getAuthorizationUrl(req: Request, res: Response) {
  const nonce = generators.nonce();
  const state = generators.state();

  res.cookie("nonce", nonce, {
    httpOnly: true,
    maxAge: getCookieExpiryInMilliseconds(),
  });
  res.cookie("state", state, {
    httpOnly: true,
    maxAge: getCookieExpiryInMilliseconds(),
  });
  res.cookie("current_url", req.url, {
    httpOnly: true,
    maxAge: getCookieExpiryInMilliseconds(),
  });

  return req.oidc.authorizationUrl({
    client_id: req.oidc.metadata.client_id,
    response_type: "code",
    prompt: "none",
    scope: req.oidc.metadata.scopes as string,
    state: state,
    nonce: nonce,
    redirect_uri: req.oidc.metadata.redirect_uris![0],
    cookie_consent: req.query.cookie_consent,
    vtr: VECTORS_OF_TRUST,
  });
}

function redirectToLogIn(req: Request, res: Response): void {
  const authorizationUrl = getAuthorizationUrl(req, res);
  return res.redirect(authorizationUrl);
}
