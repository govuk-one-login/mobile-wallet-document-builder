import { Request, Response } from "express";
import { DbsDocument } from "./models/dbsDocument";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";

const CREDENTIAL_TYPE = CredentialType.basicCheckCredential;

export async function dbsDocumentBuilderGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.query.app;
    res.render("dbs-document-details-form.njk", { selectedApp: selectedApp });
  } catch (error) {
    console.log(`An error happened: ${error}`);
    res.render("500.njk");
  }
}

export async function dbsDocumentBuilderPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.query.app;
    const document = DbsDocument.fromRequestBody(req.body, CREDENTIAL_TYPE);
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
