import { Request, Response } from "express";

export function refreshGetController(req: Request, res: Response): void {
  const { credentialType } = req.params;
  res.render("refresh-form.njk", {
    credentialType,
  });
}

export function refreshPostController(req: Request, res: Response): void {
  const { credentialType } = req.params;
  const refreshChoice = req.body.refreshChoice;
  if (!refreshChoice) {
    return res.render("refresh-form.njk", {
      isInvalid: true,
      credentialType,
    });
  }

  if (refreshChoice === "No") {
    return res.redirect("/no-update");
  }

  res.redirect(`/select-app?credentialType=${credentialType}`);
}
