import { Request, Response } from "express";
import { Document } from "./models/documentBuilder";
import { randomUUID } from "node:crypto";
import { saveDocument } from "./services/databaseService";

export async function documentBuilderGet(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("documentBuilderGet");

    res.render("document-details-form.njk");
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    res.render("500.njk");
  }
}

export async function documentBuilderPost(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("documentBuilderPost");

    const document = Document.fromRequestBody(req.body);

    const walletSubjectId = "walletSubjectIdPlaceholder";
    const documentId = randomUUID();
    await saveDocument(document, documentId, walletSubjectId);

    res.redirect(`view-credential-offer/${documentId}`);
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    res.render("500.njk");
  }
}
