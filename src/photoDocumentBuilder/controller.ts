import { Request, Response } from "express";
import { PhotoDocument } from "./models/photoDocument";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";

const CREDENTIAL_TYPE = CredentialType.photoCredential;

export async function photoDocumentBuilderGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render("photo-document-details-form.njk", {
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(error, "An error happened rendering Photo document page");
    res.render("500.njk");
  }
}

export async function photoDocumentBuilderPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const documentId = randomUUID();
    logger.info(`Processing Photo document with documentId ${documentId}`);
    const selectedError = req.body["throwError"];
    console.log(req.body)
    const document = await PhotoDocument.fromRequestBody(req.body, CREDENTIAL_TYPE);
    await saveDocument(document, documentId);

    res.redirect(
      `/view-credential-offer/${documentId}?type=${CREDENTIAL_TYPE}&error=${selectedError}`
    );
  } catch (error) {
    logger.error(error, "An error happened processing Photo document request");
    res.render("500.njk");
  }
}
