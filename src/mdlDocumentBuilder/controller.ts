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
import { validateDateFields } from "./helpers/dateValidator";
import {
  getFullDrivingPrivileges,
  getProvisionalDrivingPrivileges,
} from "./helpers/drivingPrivilegeBuilder";
import { getDefaultDates } from "./helpers/defaultDates";
import { formatDate } from "./helpers/dateFormatter";

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

    const errors = validateDateFields(body);

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

    const { photoBuffer, mimeType } = getPhoto(body.portrait);
    await uploadPhoto(photoBuffer, documentId, bucketName, mimeType);

    const data = buildMdlDataFromRequestBody(body, s3Uri);
    await saveDocument(getDocumentsTableName(), {
      documentId,
      data,
      vcType: CREDENTIAL_TYPE,
    });

    const selectedError = body["throwError"];

    if (
      selectedError === "" ||
      selectedError === "ERROR:401" ||
      selectedError === "ERROR:500" ||
      selectedError === "ERROR:CLIENT" ||
      selectedError === "ERROR:GRANT"
    ) {
      res.redirect(
        `/view-credential-offer/${documentId}?type=${CREDENTIAL_TYPE}&error=${selectedError}`,
      );
    }
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

  const fullDrivingPrivileges = getFullDrivingPrivileges(body);
  const provisionalDrivingPrivileges = getProvisionalDrivingPrivileges(body);

  return {
    family_name: body.family_name,
    given_name: body.given_name,
    title: body.title,
    welsh_licence: body.welsh_licence === "true",
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
    driving_privileges: fullDrivingPrivileges,
    ...(provisionalDrivingPrivileges.length !== 0 && {
      provisional_driving_privileges: provisionalDrivingPrivileges,
    }),
    un_distinguishing_sign: "UK",
  };
}
