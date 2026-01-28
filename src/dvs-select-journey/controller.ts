import { Request, Response } from "express";
import {
  getCookieExpiryInMilliseconds,
  getEnvironment,
} from "../config/appConfig";
import {
  WalletAppsConfig,
  walletAppsConfig as config,
} from "../config/walletAppsConfig";

export interface DvsStartConfig {
  walletAppsConfig?: WalletAppsConfig;
  cookieExpiry?: number;
}

const dvsNonProdEnvs = ["local", "dev", "build"];
const dvsProdEnvs = ["verifier-integration"];

export function dvsSelectJourneyGetController({
  walletAppsConfig = config,
  cookieExpiry = getCookieExpiryInMilliseconds(),
}: DvsStartConfig = {}) {
  return function (req: Request, res: Response): void {
    const envName = getEnvironment();
    let selectedApp;

    if (dvsNonProdEnvs.includes(envName)) {
      selectedApp = walletAppsConfig["wallet-test-build"];
    } else if (dvsProdEnvs.includes(envName)) {
      selectedApp = walletAppsConfig["wallet-test-verifier-integration"];
    }

    res.cookie("app", selectedApp, {
      httpOnly: true,
      maxAge: cookieExpiry,
    });
    return res.render("dvs-select-journey.njk");
  };
}
