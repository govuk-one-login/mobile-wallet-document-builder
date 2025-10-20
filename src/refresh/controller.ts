import { Request, Response } from "express";
import { CredentialType } from "../types/CredentialType";

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
  if (
    !Object.values(CredentialType).includes(credentialType as CredentialType)
  ) {
    throw new Error(`Unknown credential type: ${credentialType}`);
  }

  res.redirect(`/select-app/?credentialType=${credentialType}`);
}
