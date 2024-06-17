import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { getAuthorizationUrl } from "../utils/getAuthorizationUrl";
import { getBaseUrl } from "../config/appConfig";
import { apps } from "../types/Apps";

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
    res.redirect(getBaseUrl() + "/select-app");
  } else if (requiresLogin(selectedApp) && isAuthenticated === undefined) {
    await redirectToLogIn(req, res);
  } else {
    next();
  }
}

async function redirectToLogIn(req: Request, res: Response): Promise<void> {
  const authorizationUrl = getAuthorizationUrl(req, res);
  return res.redirect(authorizationUrl);
}
