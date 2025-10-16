import { Request, Response } from "express";
import { isAuthenticated } from "../utils/isAuthenticated";
import { logger } from "../middleware/logger";
import { CredentialType } from "../types/CredentialType";

export async function refreshGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { credentialType } = req.params;
    res.render("refresh-form.njk", {
      authenticated: isAuthenticated(req),
      credentialType,
    });
  } catch (error) {
    logger.error(error, "An error happened rendering Refresh Credential page");
    res.render("500.njk");
  }
}

export async function refreshPostController(
  req: Request<{ credentialType: CredentialType }>,
  res: Response,
): Promise<void> {
  try {
    const { credentialType } = req.params;
    const decision = req.body.refreshChoice;

    if (decision === "No") {
      res.render("no-update.njk", {
        authenticated: isAuthenticated(req),
        credentialType,
      });
      return;
    }
    res.render(templateByCredential[credentialType], {
      authenticated: isAuthenticated(req),
      credentialType,
    });
  } catch (error) {
    logger.error(error, "An error happened processing refresh credential");
    res.render("500.njk");
  }
}

const templateByCredential: Record<CredentialType, string> = {
  [CredentialType.SocialSecurityCredential]: "nino-document-details-form.njk",
  [CredentialType.BasicDisclosureCredential]: "dbs-document-details-form.njk",
  [CredentialType.DigitalVeteranCard]: "veteran-card-document-details-form.njk",
  [CredentialType.MobileDrivingLicence]: "mdl-document-details-form.njk",
};
