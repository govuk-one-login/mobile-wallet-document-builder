import { Request, Response } from "express";
import { logger } from "../utils/logger";

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

    res.cookie("app", selectedApp, {
      httpOnly: true,
    });

    if (selectedApp) {
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
