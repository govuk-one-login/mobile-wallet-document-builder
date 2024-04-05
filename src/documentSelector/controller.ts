import { Request, Response } from "express";

export async function documentSelectorGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.query.app;
    res.render("select-document-form.njk", { selectedApp: selectedApp });
  } catch (error) {
    console.log(`An error happened: ${error}`);
    res.render("500.njk");
  }
}

export async function documentSelectorPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.query.app;
    const selectedDocument = req.body["select-document-choice"];

    if (selectedDocument && selectedDocument === "nino") {
      res.redirect(`/build-nino-document?app=${selectedApp}`);
    } else if (selectedDocument && selectedDocument === "dbs") {
      res.redirect(`/build-dbs-document?app=${selectedApp}`);
    } else {
      res.render("select-document-form.njk", {
        isInvalid: selectedDocument === undefined,
      });
    }
  } catch (error) {
    console.log(`An error happened: ${error}`);
    res.render("500.njk");
  }
}
