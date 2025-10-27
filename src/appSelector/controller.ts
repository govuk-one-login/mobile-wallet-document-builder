import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";
import {
  getWalletApps,
  getCookieExpiryInMilliseconds,
} from "../config/appConfig";
import { buildTemplateInputForApps } from "./utils/buildTemplateInputForApps";
import {
  walletAppsConfig as config,
  WalletAppsConfig,
} from "../config/walletAppsConfig";

export interface AppSelectorConfig {
  walletAppsConfig?: WalletAppsConfig;
  walletApps?: string[];
  cookieExpiry?: number;
}

export function appSelectorGetController({
  walletAppsConfig = config,
  walletApps = getWalletApps(),
}: AppSelectorConfig = {}): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      const credentialType = req.query["credentialType"];

      res.render("select-app-form.njk", {
        apps: buildTemplateInputForApps(walletApps, walletAppsConfig),
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
  walletAppsConfig = config,
  walletApps = getWalletApps(),
  cookieExpiry = getCookieExpiryInMilliseconds(),
}: AppSelectorConfig = {}): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      const selectedApp = req.body["select-app-choice"];
      const credentialType = req.body["credentialType"];

      if (
        !selectedApp ||
        !Object.keys(walletAppsConfig).includes(selectedApp)
      ) {
        return res.render("select-app-form.njk", {
          error: true,
          apps: buildTemplateInputForApps(walletApps, walletAppsConfig),
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
