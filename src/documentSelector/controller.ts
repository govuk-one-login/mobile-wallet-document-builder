import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { CredentialType } from "../types/CredentialType";

const DOCUMENT_OPTIONS = [
  { value: CredentialType.SocialSecurityCredential, text: "NINO" },
  { value: CredentialType.BasicDisclosureCredential, text: "DBS" },
  { value: CredentialType.DigitalVeteranCard, text: "Veteran Card" },
  { value: CredentialType.MobileDrivingLicence, text: "Driving Licence" },
];

const DOCUMENT_ROUTES: Record<string, string> = {
  [CredentialType.SocialSecurityCredential]: "/build-nino-document",
  [CredentialType.BasicDisclosureCredential]: "/build-dbs-document",
  [CredentialType.DigitalVeteranCard]: "/build-veteran-card-document",
  [CredentialType.MobileDrivingLicence]: "/build-mdl-document",
};

export function documentSelectorGetController(
  req: Request,
  res: Response,
): void {
  try {
    const credentialType = req.query["credentialType"] as string;
    const route = DOCUMENT_ROUTES[credentialType];

    if (route) {
      return res.redirect(route);
    }

    return res.render("select-document-form.njk", {
      documentOptions: DOCUMENT_OPTIONS,
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(error, "An error happened rendering document selection page");
    return res.render("500.njk");
  }
}

export function documentSelectorPostController(
  req: Request,
  res: Response,
): void {
  try {
    const selectedDocument = req.body["select-document-choice"];

    if (!selectedDocument) {
      return res.render("select-document-form.njk", {
        error: true,
        documentOptions: DOCUMENT_OPTIONS,
        authenticated: isAuthenticated(req),
      });
    }

    const route = DOCUMENT_ROUTES[selectedDocument];
    if (route) {
      return res.redirect(route);
    }

    return res.render("select-document-form.njk", {
      error: true,
      documentOptions: DOCUMENT_OPTIONS,
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened processing request to select document",
    );
    return res.render("500.njk");
  }
}
