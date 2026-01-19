import { NextFunction, Request, Response } from "express";
import { getSelfUrl, getEnvironment } from "../config/appConfig";

const env = getEnvironment();

const dvsRoutes = ["/dvs"];
const issuerRoutes = ["/select-app"];

export function canRender(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const currentRoute = req.path;
  const isDvsRoute = dvsRoutes.includes(currentRoute);
  const isIssuerRoute = issuerRoutes.includes(currentRoute);
  console.log("current route", currentRoute, env);
  if (env === "SANDBOX" && isDvsRoute) {
    next();
  } else if (env === "DEV" && isIssuerRoute) {
    next();
  } else {
    res.redirect(getSelfUrl() + "/start");
  }
}
