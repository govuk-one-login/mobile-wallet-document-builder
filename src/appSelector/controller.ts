import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";
import { apps, getEnvironment, getCookieExpiry } from "../config/appConfig";
import { nonStagingApps, stagingApps } from "./views/apps";

export interface AppSelectorConfig {
  environment: string;
  cookieExpiry?: number;
}

export function appSelectorGetController(
  config: AppSelectorConfig = {
    environment: getEnvironment(),
  },
): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      res.render("select-app-form.njk", {
        apps:
          config.environment === "staging"
            ? stagingApps(apps)
            : nonStagingApps(apps),
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
  },
): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      const selectedApp = req.body["select-app-choice"];

      if (selectedApp) {
        res.cookie("app", selectedApp, {
          httpOnly: true,
          maxAge: config.cookieExpiry,
        });
        res.redirect(`/select-vc-data-model`);
      } else {
        res.render("select-app-form.njk", {
          isInvalid: selectedApp === undefined,
          apps:
            config.environment === "staging"
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
