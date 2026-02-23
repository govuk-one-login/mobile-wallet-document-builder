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
import { formatValidationError, generateErrorList } from "../utils/validation";

const SELECT_APP_TEMPLATE = "select-app-form.njk";

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

      res.render(SELECT_APP_TEMPLATE, {
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
      const selectedApp = req.body["app"];
      const credentialType = req.body["credentialType"];

      if (
        !selectedApp ||
        !Object.keys(walletAppsConfig).includes(selectedApp)
      ) {
        const errors = formatValidationError(
          "app",
          "Select the app you want to create a document in",
        );
        res.status(400);
        return res.render(SELECT_APP_TEMPLATE, {
          errors,
          errorList: generateErrorList(errors),
          ...req.body,
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
