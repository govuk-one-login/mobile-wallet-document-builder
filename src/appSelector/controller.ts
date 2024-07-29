import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { getCookieExpiry } from "../utils/getCookieExpiry";
import { isAuthenticated } from "../utils/isAuthenticated";
import { getEnvironment } from "../config/appConfig";

const ENVIRONMENT = getEnvironment();

export async function appSelectorGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render("select-app-form.njk", {
      isStaging: ENVIRONMENT === "staging",
      isNotStaging: ENVIRONMENT !== "staging",
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(error, "An error happened rendering app selection page");
    res.render("500.njk");
  }
}

export async function appSelectorPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.body["select-app-choice"];

    if (selectedApp) {
      res.cookie("app", selectedApp, {
        httpOnly: true,
        maxAge: getCookieExpiry(),
      });
      res.redirect(`/select-document`);
    } else {
      res.render("select-app-form.njk", {
        isInvalid: selectedApp === undefined,
        isStaging: ENVIRONMENT === "staging",
        isNotStaging: ENVIRONMENT !== "staging",
        authenticated: isAuthenticated(req),
      });
    }
  } catch (error) {
    logger.error(error, "An error happened selecting app");
    res.render("500.njk");
  }
}
