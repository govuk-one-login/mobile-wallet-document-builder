import { NextFunction, Request, Response } from "express";
import { AuthMiddlewareConfiguration } from "../types/AuthMiddlewareConfiguration";
import { getOIDCClient } from "../config/oidc";
import { logger } from "./logger";

export function auth(configuration: AuthMiddlewareConfiguration) {
  return async (req: Request, res: Response, next: NextFunction) => {
    req.oidc = await getOIDCClient(configuration).catch((error: Error) => {
      logger.error(error);
      throw new Error("Error building OIDC Client");
    });
    next();
  };
}
