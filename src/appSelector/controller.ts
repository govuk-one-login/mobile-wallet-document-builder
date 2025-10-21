import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";
import {
  apps,
  getEnvironment,
  getCookieExpiryInMilliseconds,
  App,
} from "../config/appConfig";

export interface AppSelectorConfig {
  environment?: string;
  cookieExpiry?: number;
}

export function appSelectorGetController({
  environment = getEnvironment(),
} = {}): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      const credentialType = req.query["credentialType"];

      res.render("select-app-form.njk", {
        credentialType,
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
      const credentialType = req.body["credentialType"];

      if (!selectedApp) {
        return res.render("select-app-form.njk", {
          credentialType,
          isInvalid: true,
          apps:
            environment === "staging"
              ? stagingApps(apps)
              : nonStagingApps(apps),
          authenticated: isAuthenticated(req),
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

const stagingApps = (apps: App[]) => {
  const filteredApps = apps.filter((app) => app.environment === "staging");
  return filteredApps.map((app) => ({ text: app.text, value: app.value }));
};

const nonStagingApps = (apps: App[]) => {
  const filteredApps = apps.filter((app) => app.environment !== "staging");
  return filteredApps.map((app) => ({ text: app.text, value: app.value }));
};
