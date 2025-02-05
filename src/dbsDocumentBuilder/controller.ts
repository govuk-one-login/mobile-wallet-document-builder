import { Request, Response } from "express";
import { DbsDocument } from "./models/dbsDocument";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import {getDocumentsTableName, getDocumentsV2TableName} from "../config/appConfig";
import {DbsRequestBody} from "./types/DbsRequestBody";
import {DbsData} from "./types/DbsData";

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

function buildDbsDataFromRequestBody(body: DbsRequestBody) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {throwError, ...newObject} = body;
  const data: DbsData = {...newObject}
  return data;
}

export async function dbsDocumentBuilderPostController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const documentId = randomUUID();
    logger.info(`Processing DBS document with documentId ${documentId}`);

    const body: DbsRequestBody = req.body;

    const selectedError = body["throwError"];


    const document = DbsDocument.fromRequestBody(body, CREDENTIAL_TYPE);
    await saveDocument(getDocumentsTableName(), {documentId, vc: JSON.stringify(document)}) //v1

    const data = buildDbsDataFromRequestBody(body);
    await saveDocument(getDocumentsV2TableName(), {documentId, data, vcDataModel: req.cookies["dataModel"], vcType: CREDENTIAL_TYPE}) //v2

    res.redirect(
      `/view-credential-offer/${documentId}?type=${CREDENTIAL_TYPE}&error=${selectedError}`
    );
  } catch (error) {
    logger.error(error, "An error happened processing DBS document request");
    res.render("500.njk");
  }
}
