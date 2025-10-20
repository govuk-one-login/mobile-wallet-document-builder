import { Request, Response } from "express";

export function refreshGetController(req: Request, res: Response): void {
  const { credentialType } = req.params;
  res.render("refresh-form.njk", {
    credentialType,
  });
}

export function refreshPostController(req: Request, res: Response): void {
  const { credentialType } = req.params;
  const { refreshCredential } = req.body;
  if (!refreshCredential) {
    return res.render("refresh-form.njk", {
      error: true,
      credentialType,
    });
  }

  if (refreshCredential === "No") {
    return res.redirect("/no-update");
  }

  res.redirect(`/select-app?credentialType=${credentialType}`);
}
