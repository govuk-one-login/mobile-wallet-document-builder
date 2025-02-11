import { Request, Response } from "express";
import { NinoDocument } from "./models/ninoDocument";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import {
  getDocumentsTableName,
  getDocumentsV2TableName,
} from "../config/appConfig";
import { NinoRequestBody } from "./types/NinoRequestBody";
import { NinoData } from "./types/NinoData";

const CREDENTIAL_TYPE = CredentialType.socialSecurityCredential;

export async function ninoDocumentBuilderGetController(
  req: Request,
  res: Response
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
  res: Response
): Promise<void> {
  try {
    const documentId = randomUUID();
    logger.info(`Processing NINO document with documentId ${documentId}`);
    const body: NinoRequestBody = req.body;
    const selectedError = body["throwError"];

    const document = NinoDocument.fromRequestBody(body, CREDENTIAL_TYPE);
    await saveDocument(getDocumentsTableName(), {
      documentId,
      vc: JSON.stringify(document),
    }); //v1

    const data = buildNinoDataFromRequestBody(body);
    await saveDocument(getDocumentsV2TableName(), {
      documentId,
      data,
      vcDataModel: req.cookies["dataModel"],
      vcType: CREDENTIAL_TYPE,
    }); //v2

    res.redirect(
      `/view-credential-offer/${documentId}?type=${CREDENTIAL_TYPE}&error=${selectedError}`
    );
  } catch (error) {
    logger.error(error, "An error happened processing NINO document request");
    res.render("500.njk");
  }
}

function buildNinoDataFromRequestBody(body: NinoRequestBody) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { throwError, ...newObject } = body;
  const data: NinoData = { ...newObject };
  return data;
}
