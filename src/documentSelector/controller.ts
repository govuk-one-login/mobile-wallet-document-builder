import { Request, Response } from "express";
import { logger } from "../middleware/logger";

export async function documentSelectorGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.cookies.app;
    res.render("select-document-form.njk", { selectedApp: selectedApp });
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
    const selectedApp = req.query.app;
    const selectedDocument = req.body["select-document-choice"];

    if (selectedDocument && selectedDocument === "nino") {
      res.redirect(`/build-nino-document?app=${selectedApp}`);
    } else if (selectedDocument && selectedDocument === "dbs") {
      res.redirect(`/build-dbs-document?app=${selectedApp}`);
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
