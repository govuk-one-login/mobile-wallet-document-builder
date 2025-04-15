import { Request, Response } from "express";
import {
  getDocumentsTableName,
  getPhotosBucketName,
} from "../config/appConfig";
import { CredentialType } from "../types/CredentialType";
import { isAuthenticated } from "../utils/isAuthenticated";
import { logger } from "../middleware/logger";
import { randomUUID } from "node:crypto";
import { uploadPhoto } from "../services/s3Service";
import { MdlData } from "./types/MdlData";
import { MdlRequestBody } from "./types/MdlRequestBody";
import { saveDocument } from "../services/databaseService";
import { getPhoto } from "../utils/photoUtils";
import {getDateFromParts, isValidDateInput } from "../utils/dateValidator";

const CREDENTIAL_TYPE = CredentialType.mobileDrivingLicence;

export async function mdlDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    res.render("mdl-document-details-form.njk", {
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened rendering Driving Licence document page",
    );
    res.render("500.njk");
  }
}

export async function mdlDocumentBuilderPostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const body: MdlRequestBody = req.body;
    const birthDateInput = body["birth-day"] + "-" + body["birth-month"] + "-" + body["birth-year"];

    if (!isValidDateInput(birthDateInput)){

      res.render("mdl-document-details-form.njk", {
        errors: {
          ["birth_date"]: "Enter a valid date",
        },
        isAuthenticated: isAuthenticated(req),
      });
      return;
    }

    const documentId = randomUUID();
    const bucketName = getPhotosBucketName();
    const s3Uri = `s3://${bucketName}/${documentId}`;

    const data = buildMdlDataFromRequestBody(body, s3Uri);
    const { photoBuffer, mimeType } = getPhoto(req.body.portrait);
    await uploadPhoto(photoBuffer, documentId, bucketName, mimeType);

    await saveDocument(getDocumentsTableName(), {
      documentId,
      data,
      vcType: CREDENTIAL_TYPE,
    });

    const selectedError = body["throwError"];
    res.redirect(
        `/view-credential-offer/${documentId}?type=${CREDENTIAL_TYPE}&error=${selectedError}`,
    );
  } catch (error) {
    logger.error(
        error,
        "An error happened processing Driving Licence document request",
    );
    res.render("500.njk");
  }
}

function buildMdlDataFromRequestBody(body: MdlRequestBody, s3Uri: string) {
  const {
    throwError: _throwError,
    "birth-day": birthDay,
    "birth-month": birthMonth,
    "birth-year": birthYear,
    "issue-day": issueDay,
    "issue-month": issueMonth,
    "issue-year": issueYear,
    "expiry-day": expiryDay,
    "expiry-month": expiryMonth,
    "expiry-year": expiryYear,
    ...newObject
  } = body;

  const birthDateStr = getDateFromParts(birthDay, birthMonth, birthYear);
  const issueDateStr = getDateFromParts(issueDay, issueMonth, issueYear);
  const expiryDateStr = getDateFromParts(expiryDay, expiryMonth, expiryYear);

  const data: MdlData = {
    ...newObject,
    portrait: s3Uri,
    birth_date: birthDateStr,
    issue_date: issueDateStr,
    expiry_date: expiryDateStr,
  };
  return data;
}
