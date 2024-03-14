import { Request, Response } from "express";
import { Document } from "./models/documentBuilder";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";

export async function documentBuilderGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render("document-details-form.njk");
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    res.render("500.njk");
  }
}

export async function documentBuilderPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
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
