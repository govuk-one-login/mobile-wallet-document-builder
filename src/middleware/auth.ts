import { NextFunction, Request, Response } from "express";
import { AuthMiddlewareConfiguration } from "../types/AuthMiddlewareConfiguration";
import { getOIDCClient } from "../config/oidc";
import { logger } from "./logger";
import { isAuthBypassed } from "../config/appConfig";

export function auth(configuration: AuthMiddlewareConfiguration) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (isAuthBypassed()) {
      return next();
    }

    try {
      req.oidc = await getOIDCClient(configuration);
      next();
    } catch (error) {
      logger.error(error, "Error building OIDC Client");
      res.render("500.njk", {
        errorMessage:
          "Failed to connect to authentication provider. Please try again later.",
      });
    }
  };
}
