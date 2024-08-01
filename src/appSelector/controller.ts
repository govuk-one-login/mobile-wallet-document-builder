import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { getCookieExpiry } from "../utils/getCookieExpiry";
import { isAuthenticated } from "../utils/isAuthenticated";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";
import { getEnvironment } from "../config/appConfig";
import { nonStagingApps, stagingApps } from "./views/apps";

export interface AppSelectorConfig {
  environment: string;
  cookieExpiry?: number;
}

export function appSelectorGetController(
  config: AppSelectorConfig = {
    environment: getEnvironment(),
  }
): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      res.render("select-app-form.njk", {
        apps: config.environment === "staging" ? stagingApps : nonStagingApps,
        authenticated: isAuthenticated(req),
      });
    } catch (error) {
      logger.error(error, "An error happened rendering app selection page");
      res.render("500.njk");
    }
  };
}

export function appSelectorPostController(
  config: AppSelectorConfig = {
    environment: getEnvironment(),
    cookieExpiry: getCookieExpiry(),
  }
): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      const selectedApp = req.body["select-app-choice"];

      if (selectedApp) {
        res.cookie("app", selectedApp, {
          httpOnly: true,
          maxAge: config.cookieExpiry,
        });
        res.redirect(`/select-document`);
      } else {
        res.render("select-app-form.njk", {
          isInvalid: selectedApp === undefined,
          apps: config.environment === "staging" ? stagingApps : nonStagingApps,
          authenticated: isAuthenticated(req),
        });
      }
    } catch (error) {
      logger.error(error, "An error happened selecting app");
      res.render("500.njk");
    }
  };
}
