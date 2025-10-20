import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";
import {
  apps,
  getEnvironment,
  getCookieExpiryInMilliseconds,
} from "../config/appConfig";
import { nonStagingApps, stagingApps } from "./views/apps";

export interface AppSelectorConfig {
  environment?: string;
  cookieExpiry?: number;
}

export function appSelectorGetController({
  environment = getEnvironment(),
} = {}): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      res.render("select-app-form.njk", {
        apps:
          environment === "staging" ? stagingApps(apps) : nonStagingApps(apps),
        authenticated: isAuthenticated(req),
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

      if (selectedApp) {
        res.cookie("app", selectedApp, {
          httpOnly: true,
          maxAge: cookieExpiry,
        });
        const credentialType = req.query["credentialType"];
        const redirectUrl = credentialType
          ? `/select-document/?credentialType=${credentialType}`
          : `/select-document`;

        res.redirect(redirectUrl);
      } else {
        res.render("select-app-form.njk", {
          isInvalid: selectedApp === undefined,
          apps:
            environment === "staging"
              ? stagingApps(apps)
              : nonStagingApps(apps),
          authenticated: isAuthenticated(req),
        });
      }
    } catch (error) {
      logger.error(error, "An error happened selecting app");
      res.render("500.njk");
    }
  };
}
