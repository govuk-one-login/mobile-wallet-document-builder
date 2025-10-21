import { Request, Response } from "express";
import { isAuthenticated } from "../utils/isAuthenticated";

export function refreshGetController(req: Request, res: Response): void {
  const { credentialType } = req.params;

  res.render("refresh-form.njk", {
    credentialType,
  });
}

export function refreshPostController(req: Request, res: Response): void {
  const { refreshCredential } = req.body;
  const { credentialType } = req.params;

  if (!refreshCredential) {
    return res.render("refresh-form.njk", {
      error: true,
      credentialType,
      authenticated: isAuthenticated(req),
    });
  }

  if (refreshCredential === "No") {
    return res.redirect(`/refresh/${credentialType}/no-update`);
  }

  return res.redirect(`/select-app?credentialType=${credentialType}`);
}

export function refreshNoUpdateGetController(
  req: Request,
  res: Response,
): void {
  const { credentialType } = req.params;

  return res.render("no-update.njk", {
    credentialType,
    authenticated: isAuthenticated(req),
  });
}
