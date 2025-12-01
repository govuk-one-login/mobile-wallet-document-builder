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
import { isErrorCode } from "../utils/isErrorCode";
import { ERROR_CHOICES } from "../utils/errorChoices";
import { getTimeToLiveEpoch } from "../utils/getTimeToLiveEpoch";

const CREDENTIAL_TYPE = CredentialType.MobileDrivingLicence;
const TTL_MINUTES = 43200;

let drivingLicenceNumber: string;

export async function mdlDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { defaultIssueDate, defaultExpiryDate } = getDefaultDates();
    drivingLicenceNumber = "EDWAR" + getRandomIntInclusive() + "SE5RO";
    res.render("mdl-document-details-form.njk", {
      defaultIssueDate,
      defaultExpiryDate,
      drivingLicenceNumber,
      authenticated: isAuthenticated(req),
      errorChoices: ERROR_CHOICES,
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
        drivingLicenceNumber,
        authenticated: isAuthenticated(req),
        errorChoices: ERROR_CHOICES,
        errors,
      });
    }

    const itemId = randomUUID();
    const bucketName = getPhotosBucketName();
    const s3Uri = `s3://${bucketName}/${itemId}`;

    const { photoBuffer, mimeType } = getPhoto(body.portrait);
    await uploadPhoto(photoBuffer, itemId, bucketName, mimeType);
    const timeToLive = getTimeToLiveEpoch(TTL_MINUTES);
    const data = buildMdlDataFromRequestBody(body, s3Uri);
    await saveDocument(getDocumentsTableName(), {
      itemId,
      documentId: data.document_number,
      data,
      vcType: CREDENTIAL_TYPE,
      credentialTtl: Number(body.credentialTtl),
      timeToLive,
    });

    const selectedError = body["throwError"];
    let redirectUrl = `/view-credential-offer/${itemId}?type=${CREDENTIAL_TYPE}`;
    if (isErrorCode(selectedError)) {
      redirectUrl += `&error=${selectedError}`;
    }
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error(
      error,
      "An error happened processing Driving Licence document request",
    );
    res.render("500.njk");
  }
}

function getRandomIntInclusive() {
  const minCeiled = Math.ceil(100000);
  const maxFloored = Math.floor(999999);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
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
