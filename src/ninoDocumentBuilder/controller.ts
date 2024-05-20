import { Request, Response } from "express";
import { NinoDocument } from "./models/ninoDocument";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../utils/logger";

const CREDENTIAL_TYPE = CredentialType.socialSecurityCredential;

export async function ninoDocumentBuilderGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const selectedApp = req.query.app;
    res.render("nino-document-details-form.njk", { selectedApp: selectedApp });
  } catch (error) {
    logger.error(error, "An error happened rendering NINO document page");
    res.render("500.njk");
  }
}

export async function ninoDocumentBuilderPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const documentId = randomUUID();
    logger.info(`Processing NINO document with documentId ${documentId}`);
    const selectedApp = req.query.app;
    const selectedError = req.body["throwError"];
    const document = NinoDocument.fromRequestBody(req.body, CREDENTIAL_TYPE);
    const walletSubjectId = "walletSubjectIdPlaceholder";
    await saveDocument(document, documentId, walletSubjectId);

    res.redirect(
      `/view-credential-offer/${documentId}?app=${selectedApp}&type=${CREDENTIAL_TYPE}&error=${selectedError}`
    );
  } catch (error) {
    logger.error(error, "An error happened processing NINO document request");
    res.render("500.njk");
  }
}
