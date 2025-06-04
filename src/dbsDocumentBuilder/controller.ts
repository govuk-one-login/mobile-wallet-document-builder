import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { getDocumentsTableName } from "../config/appConfig";
import { DbsRequestBody } from "./types/DbsRequestBody";
import { DbsData } from "./types/DbsData";
import { ERROR_CODES } from "../utils/errorCodes";
import { isValidErrorCode } from "../utils/isValidErrorCode";

const CREDENTIAL_TYPE = CredentialType.basicCheckCredential;

export async function dbsDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    res.render("dbs-document-details-form.njk", {
      authenticated: isAuthenticated(req),
      errorCodes: ERROR_CODES,
    });
  } catch (error) {
    logger.error(error, "An error happened rendering DBS document page");
    res.render("error.njk");
  }
}

export async function dbsDocumentBuilderPostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const body: DbsRequestBody = req.body;
    const data = buildDbsDataFromRequestBody(body);
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
    logger.error(error, "An error happened processing DBS document request");
    res.render("error.njk");
  }
}

function buildDbsDataFromRequestBody(body: DbsRequestBody) {
  const {
    throwError: _throwError,
    credentialTtl: _credentialTtl,
    ...newObject
  } = body;
  const data: DbsData = {
    certificateType: "basic",
    outcome: "Result clear",
    policeRecordsCheck: "Clear",
    credentialTtlMinutes: Number(body.credentialTtl),
    ...newObject,
  };
  return data;
}
