import { Request, Response } from "express";
import { DbsDocument } from "./models/dbsDocument";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";

const CREDENTIAL_TYPE = CredentialType.basicCheckCredential;

export async function dbsDocumentBuilderGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render("dbs-document-details-form.njk", {
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(error, "An error happened rendering DBS document page");
    res.render("500.njk");
  }
}

export async function dbsDocumentBuilderPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const documentId = randomUUID();
    logger.info(`Processing DBS document with documentId ${documentId}`);
    const selectedError = req.body["throwError"];
    const document = DbsDocument.fromRequestBody(req.body, CREDENTIAL_TYPE);
    const walletSubjectId = "walletSubjectIdPlaceholder";
    await saveDocument(document, documentId, walletSubjectId);

    res.redirect(
      `/view-credential-offer/${documentId}?type=${CREDENTIAL_TYPE}&error=${selectedError}`
    );
  } catch (error) {
    logger.error(error, "An error happened processing DBS document request");
    res.render("500.njk");
  }
}
