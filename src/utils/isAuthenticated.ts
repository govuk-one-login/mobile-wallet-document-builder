import e from "express";
import { isAuthBypassed } from "../config/appConfig";

export function isAuthenticated(req: e.Request): boolean {
  if (isAuthBypassed()) {
    return false;
  } else return !!req.cookies?.id_token;
}
