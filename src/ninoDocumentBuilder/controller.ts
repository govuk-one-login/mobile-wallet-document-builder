import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { getDocumentsTableName } from "../config/appConfig";
import { NinoRequestBody } from "./types/NinoRequestBody";
import { NinoData } from "./types/NinoData";
import { getCredentialTtl } from "../utils/CredentialTtl";

const CREDENTIAL_TYPE = CredentialType.socialSecurityCredential;

export async function ninoDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    res.render("nino-document-details-form.njk", {
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(error, "An error happened rendering NINO document page");
    res.render("500.njk");
  }
}

export async function ninoDocumentBuilderPostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const documentId = randomUUID();
    logger.info(`Processing NINO document with documentId ${documentId}`);
    const body: NinoRequestBody = req.body;
    const selectedError = body["throwError"];
    const credentialTtlMinutes = getCredentialTtl(body.credentialTtl);

    const data = buildNinoDataFromRequestBody(body, credentialTtlMinutes);
    await saveDocument(getDocumentsTableName(), {
      documentId,
      data,
      vcType: CREDENTIAL_TYPE,
    });

    res.redirect(
      `/view-credential-offer/${documentId}?type=${CREDENTIAL_TYPE}&error=${selectedError}`,
    );
  } catch (error) {
    logger.error(error, "An error happened processing NINO document request");
    res.render("500.njk");
  }
}

function buildNinoDataFromRequestBody(
  body: NinoRequestBody,
  credentialTtlMinutes: number,
) {
  const {
    throwError: _throwError,
    credentialTtl: _credentialTtl,
    ...newObject
  } = body;
  const data: NinoData = {
    ...newObject,
    credentialTtlMinutes: credentialTtlMinutes,
  };
  return data;
}
