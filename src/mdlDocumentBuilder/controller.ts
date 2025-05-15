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
import { formatDate, isDateInPast, isValidDate } from "../utils/dateValidator";
import { buildDrivingPrivileges } from "../utils/drivingPrivilegeBuilder";
import { DrivingPrivilege } from "./types/DrivingPrivilege";

const CREDENTIAL_TYPE = CredentialType.mobileDrivingLicence;

export async function mdlDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { defaultIssueDate, defaultExpiryDate } = getDefaultDates();
    res.render("mdl-document-details-form.njk", {
      defaultIssueDate,
      defaultExpiryDate,
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
    const errors: Record<string, string> = {};

    if (
      !isValidDate(
        body["birth-day"],
        body["birth-month"],
        body["birth-year"],
      ) ||
      !isDateInPast(body["birth-day"], body["birth-month"], body["birth-year"])
    ) {
      errors["birth_date"] = "Enter a valid birth date";
    }
    if (
      !isValidDate(
        body["issue-day"],
        body["issue-month"],
        body["issue-year"],
      ) ||
      !isDateInPast(body["issue-day"], body["issue-month"], body["issue-year"])
    ) {
      errors["issue_date"] = "Enter a valid issue date";
    }
    if (
      !isValidDate(
        body["expiry-day"],
        body["expiry-month"],
        body["expiry-year"],
      ) ||
      isDateInPast(
        body["expiry-day"],
        body["expiry-month"],
        body["expiry-year"],
      )
    ) {
      errors["expiry_date"] = "Enter a valid expiry date";
    }

    if (Object.keys(errors).length > 0) {
      const { defaultIssueDate, defaultExpiryDate } = getDefaultDates();
      return res.render("mdl-document-details-form.njk", {
        defaultIssueDate,
        defaultExpiryDate,
        authenticated: isAuthenticated(req),
        errors,
      });
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
    vehicleCategoryCode: _vehicleCategoryCode,
    "fullPrivilegeIssue-day": _fullPrivilegeIssueDay,
    "fullPrivilegeIssue-month": _fullPrivilegeIssueMonth,
    "fullPrivilegeIssue-year": _fullPrivilegeIssueYear,
    "fullPrivilegeExpiry-day": _fullPrivilegeExpiryDay,
    "fullPrivilegeExpiry-month": _fullPrivilegeExpiryMonth,
    "fullPrivilegeExpiry-year": _fullPrivilegeExpiryYear,
    ...newObject
  } = body;

  const birthDateStr = formatDate(birthDay, birthMonth, birthYear);
  const issueDateStr = formatDate(issueDay, issueMonth, issueYear);
  const expiryDateStr = formatDate(expiryDay, expiryMonth, expiryYear);

  const drivingPrivileges: DrivingPrivilege[] = buildDrivingPrivileges(body);

  const data: MdlData = {
    ...newObject,
    portrait: s3Uri,
    birth_date: birthDateStr,
    issue_date: issueDateStr,
    expiry_date: expiryDateStr,
    driving_privileges: drivingPrivileges,
  };

  return data;
}

interface DateParts {
  day: string;
  month: string;
  year: string;
}

function getDefaultDates(): {
  defaultIssueDate: DateParts;
  defaultExpiryDate: DateParts;
} {
  const issueDate = new Date();
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 10); // Expires in 10 years
  expiryDate.setDate(expiryDate.getDate() - 1);

  return {
    defaultIssueDate: getDateParts(issueDate),
    defaultExpiryDate: getDateParts(expiryDate),
  };
}

function getDateParts(date: Date): DateParts {
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: date.getFullYear().toString(),
  };
}
