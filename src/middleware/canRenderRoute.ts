import { NextFunction, Request, Response } from "express";
import { getSelfUrl, getEnvironment } from "../config/appConfig";
import { commonRoutes, dvsRoutes, gdsRoutes } from "../config/routes";
import { allDvsEnvs, gdsEnvs } from "../config/environments";

export function canRenderRoute(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const currentRoute = req.path;
  const currentEnvironment = getEnvironment();

  const isDvsRoute = dvsRoutes.includes(currentRoute);
  const isIssuerRoute = gdsRoutes.includes(currentRoute);
  const isCommonRoute = commonRoutes.includes(currentRoute);

  const isDvsEnvironment = allDvsEnvs.includes(currentEnvironment);
  const isIssuerEnvironment = gdsEnvs.includes(currentEnvironment);

  if (isCommonRoute) {
    next();
  } else if (isDvsRoute && isDvsEnvironment) {
    next();
  } else if (isIssuerRoute && isIssuerEnvironment) {
    next();
  } else if (isDvsEnvironment) {
    res.redirect(getSelfUrl() + "/dvs-start");
  } else if (isIssuerEnvironment) {
    res.redirect(getSelfUrl() + "/select-app");
  } else {
    res.redirect("/");
  }
}
