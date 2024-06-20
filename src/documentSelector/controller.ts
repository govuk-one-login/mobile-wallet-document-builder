import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";

export async function documentSelectorGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render("select-document-form.njk", {
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(error, "An error happened rendering document selection page");
    res.render("500.njk");
  }
}

export async function documentSelectorPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedDocument = req.body["select-document-choice"];

    if (selectedDocument && selectedDocument === "nino") {
      res.redirect(`/build-nino-document`);
    } else if (selectedDocument && selectedDocument === "dbs") {
      res.redirect(`/build-dbs-document`);
    } else {
      res.render("select-document-form.njk", {
        isInvalid: selectedDocument === undefined,
      });
    }
  } catch (error) {
    logger.error(
      error,
      "An error happened processing request to select document"
    );
    res.render("500.njk");
  }
}
