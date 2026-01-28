import { NextFunction, Request, Response } from "express";
import { getSelfUrl, getEnvironment } from "../config/appConfig";

const dvsRoutes = ["/dvs-start", "/dvs-select-journey", "/dvs-issue-test-mdl"];
const issuerRoutes = ["/select-app", "/select-document"];
const commonRoute = ["/view-credential-offer"];

const dvsEnvs = ["local", "dev", "build", "verifier-integration"];
const issuerEnvs = ["local", "dev", "build", "stage"];

export function canRenderRoute(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const currentRoute = req.path;
  const currentEnvironment = getEnvironment();

  const isDvsRoute = dvsRoutes.includes(currentRoute);
  const isIssuerRoute = issuerRoutes.includes(currentRoute);
  const isCommonRoute = commonRoute.includes(currentRoute);

  const isDvsEnvironment = dvsEnvs.includes(currentEnvironment);
  const isIssuerEnvironment = issuerEnvs.includes(currentEnvironment);

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
