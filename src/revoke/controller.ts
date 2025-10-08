import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { revokeCredentials } from "./services/revokeService";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";
import { getCriEndpoint } from "../config/appConfig";

export interface RevokeConfig {
  criUrl?: string;
}

export function revokeGetController(): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    res.render("revoke-form.njk");
  };
}

export function revokePostController({
  criUrl = getCriEndpoint(),
}: RevokeConfig = {}): ExpressRouteFunction {
  return async function (req: Request, res: Response): Promise<void> {
    try {
      const drivingLicenceNumber = req.body["drivingLicenceNumber"];

      const result = await revokeCredentials(criUrl, drivingLicenceNumber);

      res.render("revoke-form.njk", {
        message: result.message,
        messageType: result.messageType,
      });
    } catch (error) {
      logger.error(
        error,
        "An error happened trying to revoke the credential(s)",
      );
      res.render("500.njk");
    }
  };
}
