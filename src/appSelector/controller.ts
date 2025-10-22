import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";
import {
  getEnvironment,
  getCookieExpiryInMilliseconds,
} from "../config/appConfig";
import { getAppsByEnvironment } from "./utils/getAppsByEnvironment";

export interface AppSelectorConfig {
  environment?: string;
  cookieExpiry?: number;
}

export function appSelectorGetController({
  environment = getEnvironment(),
}: AppSelectorConfig = {}): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      const credentialType = req.query["credentialType"];

      res.render("select-app-form.njk", {
        apps: getAppsByEnvironment(environment),
        authenticated: isAuthenticated(req),
        credentialType,
      });
    } catch (error) {
      logger.error(error, "An error happened rendering app selection page");
      res.render("500.njk");
    }
  };
}

export function appSelectorPostController({
  environment = getEnvironment(),
  cookieExpiry = getCookieExpiryInMilliseconds(),
}: AppSelectorConfig = {}): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      const selectedApp = req.body["select-app-choice"];
      const credentialType = req.body["credentialType"];

      const allowedApps = getAppsByEnvironment(environment);
      const allowedAppValues = allowedApps.map((app) => app.value);

      if (!selectedApp || !allowedAppValues.includes(selectedApp)) {
        return res.render("select-app-form.njk", {
          error: true,
          apps: allowedApps,
          authenticated: isAuthenticated(req),
          credentialType,
        });
      }

      res.cookie("app", selectedApp, {
        httpOnly: true,
        maxAge: cookieExpiry,
      });

      const redirectUrl = credentialType
        ? `/select-document?credentialType=${credentialType}`
        : `/select-document`;

      res.redirect(redirectUrl);
    } catch (error) {
      logger.error(error, "An error happened selecting app");
      res.render("500.njk");
    }
  };
}
