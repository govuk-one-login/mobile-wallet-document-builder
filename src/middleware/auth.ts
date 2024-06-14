import { NextFunction, Request, Response } from "express";
import { AuthMiddlewareConfiguration } from "../types/AuthMiddlewareConfiguration";
import {getOIDCClient} from "../config/oidc";

export function auth(configuration: AuthMiddlewareConfiguration) {
    return async (req: Request, res: Response, next: NextFunction) => {
        req.oidc = await getOIDCClient(configuration).catch((err: Error) => {
            throw new Error(err.message);
        });
        next();
    };
}