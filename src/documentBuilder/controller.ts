import { Request, Response } from "express";
import { Document } from "./models/documentBuilder";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";

export async function documentBuilderSelectAppGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render("select-app-form.njk");
  } catch (error) {
    console.log(
      `An error happened: ${JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      )}`
    );
    res.render("500.njk");
  }
}

export async function documentBuilderSelectAppPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.body["select-app-choice"];

    if (selectedApp) {
      res.redirect(`/build-document?app=${selectedApp}`);
    } else {
      res.render("select-app-form.njk", {
        isInvalid: selectedApp === undefined,
      });
    }
  } catch (error) {
    console.log(
      `An error happened: ${JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      )}`
    );
    res.render("500.njk");
  }
}

export async function documentBuilderBuildDocumentGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.query.app;
    res.render("document-details-form.njk", { selectedApp: selectedApp });
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    res.render("500.njk");
  }
}

export async function documentBuilderBuildDocumentPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.query.app;
    const document = Document.fromRequestBody(req.body);

    const walletSubjectId = "walletSubjectIdPlaceholder";
    const documentId = randomUUID();
    await saveDocument(document, documentId, walletSubjectId);

    res.redirect(`/view-credential-offer/${documentId}?app=${selectedApp}`);
  } catch (error) {
    console.log(
      `An error happened: ${JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      )}`
    );
    res.render("500.njk");
  }
}
