import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { getDocumentsTableName, getEnvironment } from "../config/appConfig";
import { DbsRequestBody } from "./types/DbsRequestBody";
import { DbsData } from "./types/DbsData";
import { isErrorCode } from "../utils/isErrorCode";
import { ERROR_CHOICES } from "../utils/errorChoices";
import { getTimeToLiveEpoch } from "../utils/getTimeToLiveEpoch";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";

const CREDENTIAL_TYPE = CredentialType.BasicDisclosureCredential;
const TTL_MINUTES = 43200;

export interface DbsDocumentBuilderControllerConfig {
  environment?: string;
}

export function dbsDocumentBuilderGetController({
  environment = getEnvironment(),
}: DbsDocumentBuilderControllerConfig = {}): ExpressRouteFunction {
  return async function (req: Request, res: Response): Promise<void> {
    try {
      const showThrowError = environment !== "staging";
      res.render("dbs-document-details-form.njk", {
        authenticated: isAuthenticated(req),
        errorChoices: ERROR_CHOICES,
        showThrowError,
      });
    } catch (error) {
      logger.error(error, "An error happened rendering DBS document page");
      res.render("500.njk");
    }
  };
}
export async function dbsDocumentBuilderPostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const body: DbsRequestBody = req.body;
    const data = buildDbsDataFromRequestBody(body);
    const timeToLive = getTimeToLiveEpoch(TTL_MINUTES);
    const itemId = randomUUID();
    await saveDocument(getDocumentsTableName(), {
      itemId,
      documentId: data.certificateNumber,
      data,
      vcType: CREDENTIAL_TYPE,
      timeToLive,
    });

    const selectedError = body["throwError"];
    let redirectUrl = `/view-credential-offer/${itemId}?type=${CREDENTIAL_TYPE}`;
    if (isErrorCode(selectedError)) {
      redirectUrl += `&error=${selectedError}`;
    }
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error(error, "An error happened processing DBS document request");
    res.render("500.njk");
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
