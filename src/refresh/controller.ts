import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { CredentialType } from "../types/CredentialType";

export async function refreshGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { credentialType } = req.params;
    res.render("refresh-form.njk", {
      credentialType,
    });
  } catch (error) {
    logger.error(error, "An error happened rendering Refresh Credential page");
    res.render("500.njk");
  }
}

export async function refreshPostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { credentialType } = req.params;
    const refreshChoice = req.body.refreshChoice;

    if (refreshChoice === "No") {
      return res.redirect("/no-update");
    }

    if (
      !Object.values(CredentialType).includes(credentialType as CredentialType)
    ) {
      throw new Error(`Unknown credential type: ${credentialType}`);
    }

    res.redirect(`/select-app/?credentialType=${credentialType}`);
  } catch (error) {
    logger.error(error, "An error happened processing refresh credential");
    res.render("500.njk");
  }
}
