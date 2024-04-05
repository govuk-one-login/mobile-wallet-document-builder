import { Request, Response } from "express";
import { NinoDocument } from "./models/ninoDocument";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";

const CREDENTIAL_TYPE = "SocialSecurityCredential";

export async function ninoDocumentBuilderGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.query.app;
    res.render("nino-document-details-form.njk", { selectedApp: selectedApp });
  } catch (error) {
    console.log(`An error happened: ${error}`);
    res.render("500.njk");
  }
}

export async function ninoDocumentBuilderPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.query.app;
    const document = NinoDocument.fromRequestBody(req.body);
    const walletSubjectId = "walletSubjectIdPlaceholder";
    const documentId = randomUUID();
    await saveDocument(document, documentId, walletSubjectId);

    res.redirect(
      `/view-credential-offer/${documentId}?app=${selectedApp}&type=${CREDENTIAL_TYPE}`
    );
  } catch (error) {
    console.log(`An error happened: ${error}`);
    res.render("500.njk");
  }
}
