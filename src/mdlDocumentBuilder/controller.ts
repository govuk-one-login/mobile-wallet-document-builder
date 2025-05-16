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
import { formatDate, isDateInPast, isValidDate } from "./helpers/dateValidator";
import { buildDrivingPrivileges } from "./helpers/drivingPrivilegeBuilder";

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

function buildMdlDataFromRequestBody(
  body: MdlRequestBody,
  s3Uri: string,
): MdlData {
  const birthDay = body["birth-day"];
  const birthMonth = body["birth-month"];
  const birthYear = body["birth-year"];
  const issueDay = body["issue-day"];
  const issueMonth = body["issue-month"];
  const issueYear = body["issue-year"];
  const expiryDay = body["expiry-day"];
  const expiryMonth = body["expiry-month"];
  const expiryYear = body["expiry-year"];

  const data: MdlData = {
    family_name: body.family_name,
    given_name: body.given_name,
    portrait: s3Uri,
    birth_date: formatDate(birthDay, birthMonth, birthYear),
    birth_place: body.birth_place,
    issue_date: formatDate(issueDay, issueMonth, issueYear),
    expiry_date: formatDate(expiryDay, expiryMonth, expiryYear),
    issuing_authority: body.issuing_authority,
    issuing_country: body.issuing_country,
    document_number: body.document_number,
    resident_address: body.resident_address,
    resident_postal_code: body.resident_postal_code,
    resident_city: body.resident_city,
    full_driving_privileges: buildDrivingPrivileges(body),
    un_distinguishing_sign: "UK",
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
