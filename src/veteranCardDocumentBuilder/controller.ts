import { Request, Response } from "express";
import { VeteranCardDocument } from "./models/veteranCardDocument";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";

const CREDENTIAL_TYPE = CredentialType.veteranCard;

export async function veteranCardDocumentBuilderGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render("veteran-card-document-details-form.njk", {
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened rendering Veteran Card document page"
    );
    res.render("500.njk");
  }
}

export async function veteranCardDocumentBuilderPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const documentId = randomUUID();
    const selectedError = req.body["throwError"];
    const document = VeteranCardDocument.fromRequestBody(
      req.body,
      CREDENTIAL_TYPE
    );
    await saveDocument(document, documentId);

    res.redirect(
      `/view-credential-offer/${documentId}?type=${CREDENTIAL_TYPE}&error=${selectedError}`
    );
  } catch (error) {
    logger.error(
      error,
      "An error happened processing Veteran Card document request"
    );
    res.render("500.njk");
  }
}
