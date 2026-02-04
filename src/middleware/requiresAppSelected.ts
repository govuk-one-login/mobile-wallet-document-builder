import { NextFunction, Request, Response } from "express";
import { getSelfUrl } from "../config/appConfig";

export function requiresAppSelected(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const selectedApp = req.cookies["app"];

  if (selectedApp === undefined) {
    res.redirect(getSelfUrl() + "/select-app");
  }
  next();
}
