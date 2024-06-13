import { Request, Response } from "express";
import { logger } from "../utils/logger";
import {apps} from "../types/Apps";

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

function requiresLogin(selectedApp: string) {
  return apps[selectedApp].login;
}

export async function appSelectorPostController(
    req: Request,
    res: Response
): Promise<void> {
  try {
    const selectedApp = req.body["select-app-choice"];

    if (!selectedApp) {
      res.render("select-app-form.njk", {
        isInvalid: selectedApp === undefined,
      });
    } else if (requiresLogin(selectedApp)) {
      console.log("LOGIN REQUIRED")
      res.redirect("/authorizationUrl");
    } else {
      console.log("LOGIN NOT REQUIRED")
      res.redirect(`/select-document?app=${selectedApp}`);
    }

  } catch (error) {
    logger.error(error, "An error happened selecting app");
    res.render("500.njk");
  }
}