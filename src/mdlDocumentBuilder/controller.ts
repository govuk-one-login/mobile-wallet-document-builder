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

const CREDENTIAL_TYPE = CredentialType.mobileDrivingLicense;

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
      "An error happened rendering Driving License document page",
    );
    res.render("500.njk");
  }
}

export async function mdlDocumentBuilderPostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const documentId = randomUUID();
    const bucketName = getPhotosBucketName();
    const s3Uri = `s3://${bucketName}/${documentId}`;
    const body: MdlRequestBody = req.body;
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
      "An error happened processing Driving License document request",
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

  const errors: string[] = [];

  const birthErr = validateDateField("birth_date", birthDateStr);
  if (birthErr) errors.push(birthErr);

  const issueErr = validateDateField("issue_date", issueDateStr);
  if (issueErr) errors.push(issueErr);

  const expiryErr = validateDateField("expiry_date", expiryDateStr);
  if (expiryErr) errors.push(expiryErr);

  if (errors.length > 0) {
    throw new Error(`Date validation failed: ${errors.join(', ')}`);
  }

  const data: MdlData = {
    ...newObject,
    portrait: s3Uri,
    birth_date: birthDateStr,
    issue_date: issueDateStr,
    expiry_date: expiryDateStr,
  };
  return data;
}

function getDateFromParts(day: string, month: string, year: string){
  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");
  return `${paddedDay}-${paddedMonth}-${year}`;
}

function isValidDateFormat(dateStr: string) {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return false;

  const [day, month, year] = parts;
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return false;

  return !(isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year)));
}

function isRealDate(dateStr: string) {
  const [dayStr, monthStr, yearStr] = dateStr.split("-");
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  const date = new Date(year, month - 1, day);
  return (
      date.getFullYear() === year &&
      date.getMonth() === (month - 1) &&
      date.getDate() === day
  );
}

function validateDateField(fieldName: string, dateStr: string) {
  if (!isValidDateFormat(dateStr)) {
    return `Invalid date format for ${fieldName}, must be in DD-MM-YYYY format. (Received: "${dateStr}")`;
  }
  if (!isRealDate(dateStr)) {
    return `${dateStr} is not a valid calendar date. (Received: "${dateStr}")`;
  }
  return null;
}