import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { getDocumentsTableName } from "../config/appConfig";
import { NinoRequestBody } from "./types/NinoRequestBody";
import { NinoData } from "./types/NinoData";
import { isErrorCode } from "../utils/isErrorCode";
import { ERROR_CHOICES } from "../utils/errorChoices";

const CREDENTIAL_TYPE = CredentialType.socialSecurityCredential;

export async function ninoDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    res.render("nino-document-details-form.njk", {
      authenticated: isAuthenticated(req),
      errorChoices: ERROR_CHOICES,
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
    const body: NinoRequestBody = req.body;
    const data = buildNinoDataFromRequestBody(body);
    const documentId = randomUUID();
    await saveDocument(getDocumentsTableName(), {
      documentId,
      data,
      vcType: CREDENTIAL_TYPE,
    });

    const selectedError = body["throwError"];
    let redirectUrl = `/view-credential-offer/${documentId}?type=${CREDENTIAL_TYPE}`;
    if (isErrorCode(selectedError)) {
      redirectUrl += `&error=${selectedError}`;
    }
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error(error, "An error happened processing NINO document request");
    res.render("500.njk");
  }
}

function buildNinoDataFromRequestBody(body: NinoRequestBody) {
  const {
    throwError: _throwError,
    credentialTtl: _credentialTtl,
    ...newObject
  } = body;
  const data: NinoData = {
    ...newObject,
    credentialTtlMinutes: Number(body.credentialTtl),
  };
  return data;
}
