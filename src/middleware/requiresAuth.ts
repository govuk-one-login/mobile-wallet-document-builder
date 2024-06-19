import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";
import { getSelfUrl } from "../config/appConfig";
import { apps } from "../types/Apps";
import { generators } from "openid-client";
import e from "express";
import { getCookieExpiry } from "../utils/getCookieExpiry";

const VECTORS_OF_TRUST = `["Cl"]`;

export function requiresLogin(selectedApp: string) {
  return apps[selectedApp].login;
}

export async function requiresAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const isAuthenticated = req.cookies["id_token"];
  const selectedApp = req.cookies["app"];

  logger.info(
    `isAuthenticated = ${isAuthenticated} , selectedApp = ${selectedApp}`
  );

  if (selectedApp === undefined) {
    res.redirect(getSelfUrl() + "/select-app");
  } else if (requiresLogin(selectedApp) && isAuthenticated === undefined) {
    await redirectToLogIn(req, res);
  } else {
    next();
  }
}

export function getAuthorizationUrl(req: e.Request, res: e.Response) {
  const nonce = generators.nonce();
  const state = generators.state();

  res.cookie("nonce", nonce, {
    httpOnly: true,
    maxAge: getCookieExpiry(),
  });
  res.cookie("state", state, {
    httpOnly: true,
    maxAge: getCookieExpiry(),
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

async function redirectToLogIn(req: Request, res: Response): Promise<void> {
  const authorizationUrl = getAuthorizationUrl(req, res);
  return res.redirect(authorizationUrl);
}
