import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { getDocumentsTableName } from "../config/appConfig";
import { NinoRequestBody } from "./types/NinoRequestBody";
import { NinoData } from "./types/NinoData";
import { ERROR_CODES } from "../utils/errorCodes";
import { isValidErrorCode } from "../utils/isValidErrorCode";
import { DbsRequestBody } from "../dbsDocumentBuilder/types/DbsRequestBody";

const CREDENTIAL_TYPE = CredentialType.socialSecurityCredential;

export async function ninoDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    res.render("nino-document-details-form.njk", {
      authenticated: isAuthenticated(req),
      errorCodes: ERROR_CODES,
    });
  } catch (error) {
    logger.error(error, "An error happened rendering NINO document page");
    res.render("error.njk");
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
    if (!isValidErrorCode(selectedError)) {
      return res.render("error.njk");
    }
    res.redirect(
      `/view-credential-offer/${documentId}?type=${CREDENTIAL_TYPE}&error=${selectedError}`,
    );
  } catch (error) {
    logger.error(error, "An error happened processing NINO document request");
    res.render("error.njk");
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
