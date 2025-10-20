import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";

export function documentSelectorGetController(
  req: Request,
  res: Response,
): void {
  try {
    const credentialType = req.query["credentialType"];
    if (!credentialType) {
      res.render("select-document-form.njk", {
        authenticated: isAuthenticated(req),
      });
    }
    if (credentialType === "SocialSecurityCredential") {
      res.redirect(`/build-nino-document`);
    } else if (credentialType === "BasicDisclosureCredential") {
      res.redirect(`/build-dbs-document`);
    } else if (credentialType === "DigitalVeteranCard") {
      res.redirect(`/build-veteran-card-document`);
    } else if (credentialType === "org.iso.18013.5.1.mDL") {
      res.redirect(`/build-mdl-document`);
    } else {
      res.render("select-document-form.njk", {
        isInvalid: credentialType === undefined,
        authenticated: isAuthenticated(req),
      });
    }
  } catch (error) {
    logger.error(error, "An error happened rendering document selection page");
    res.render("500.njk");
  }
}

export function documentSelectorPostController(
  req: Request,
  res: Response,
): void {
  try {
    const selectedDocument = req.body["select-document-choice"];

    if (selectedDocument && selectedDocument === "nino") {
      res.redirect(`/build-nino-document`);
    } else if (selectedDocument && selectedDocument === "dbs") {
      res.redirect(`/build-dbs-document`);
    } else if (selectedDocument && selectedDocument === "vet") {
      res.redirect(`/build-veteran-card-document`);
    } else if (selectedDocument && selectedDocument === "mdl") {
      res.redirect(`/build-mdl-document`);
    } else {
      res.render("select-document-form.njk", {
        isInvalid: selectedDocument === undefined,
        authenticated: isAuthenticated(req),
      });
    }
  } catch (error) {
    logger.error(
      error,
      "An error happened processing request to select document",
    );
    res.render("500.njk");
  }
}
