import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";

export function documentSelectorGetController(
  req: Request,
  res: Response
): void {
  try {
    res.render("select-document-form.njk", {
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(error, "An error happened rendering document selection page");
    res.render("500.njk");
  }
}

export function documentSelectorPostController(
  req: Request,
  res: Response
): void {
  try {
    const selectedDocument = req.body["select-document-choice"];

    if (selectedDocument && selectedDocument === "nino") {
      res.redirect(`/build-nino-document`);
    } else if (selectedDocument && selectedDocument === "dbs") {
      res.redirect(`/build-dbs-document`);
    } else if (selectedDocument && selectedDocument === "vet") {
      console.log(selectedDocument);
      res.redirect(`/build-veteran-card-document`);
    } else {
      res.render("select-document-form.njk", {
        isInvalid: selectedDocument === undefined,
        authenticated: isAuthenticated(req),
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
