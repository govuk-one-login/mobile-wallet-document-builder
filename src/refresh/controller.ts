import { Request, Response } from "express";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";

export function refreshGetController(req: Request, res: Response): void {
  const { credentialType } = req.params;
  res.render("refresh-form.njk", {
    credentialType,
  });
}

export function refreshPostController(req: Request, res: Response): void {
  const refreshChoice = req.body.refreshChoice;
  if (refreshChoice === "No") {
    return res.redirect("/no-update");
  }

  const { credentialType } = req.params;
  res.redirect(`/select-app?credentialType=${credentialType}`);
}
