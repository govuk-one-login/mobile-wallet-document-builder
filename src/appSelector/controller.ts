import { Request, Response } from "express";

export async function appSelectorGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render("select-app-form.njk");
  } catch (error) {
    console.log(`An error happened: ${error}`);
    res.render("500.njk");
  }
}

export async function appSelectorPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.body["select-app-choice"];

    if (selectedApp) {
      res.redirect(`/select-document?app=${selectedApp}`);
    } else {
      res.render("select-app-form.njk", {
        isInvalid: selectedApp === undefined,
      });
    }
  } catch (error) {
    console.log(`An error happened: ${error}`);
    res.render("500.njk");
  }
}
