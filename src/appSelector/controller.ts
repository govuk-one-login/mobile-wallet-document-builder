import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { getCookieExpiry } from "../utils/getCookieExpiry";

export async function appSelectorGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render("select-app-form.njk");
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
      });
    }
  } catch (error) {
    logger.error(error, "An error happened selecting app");
    res.render("500.njk");
  }
}
