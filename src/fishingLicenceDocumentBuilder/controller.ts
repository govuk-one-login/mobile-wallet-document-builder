import { Request, Response } from "express";
import { formatDate, getDefaultDates, validateDateFields } from "../utils/date";
import { isAuthenticated } from "../utils/isAuthenticated";
import { ERROR_CHOICES } from "../utils/errorChoices";
import { logger } from "../middleware/logger";
import { randomUUID } from "node:crypto";
import {
  getDocumentsTableName,
  getPhotosBucketName,
} from "../config/appConfig";
import { getPhoto } from "../utils/photoUtils";
import { uploadPhoto } from "../services/s3Service";
import { getTimeToLiveEpoch } from "../utils/getTimeToLiveEpoch";
import { FishingLicenceRequestBody } from "./types/FishingLicenceRequestBody";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { FishingLicenceData } from "./types/FishingLicenceData";
import { isErrorCode } from "../utils/isErrorCode";
import { getRandomIntInclusive } from "../utils/getRandomIntInclusive";

const CREDENTIAL_TYPE = CredentialType.FishingLicence;
const TTL_MINUTES = 43200;
const FISH_TYPES = [
  "Coarse fish",
  "Salmon and trout",
  "Sea fishing",
  "All freshwater fish",
];
const fishTypeOptions = FISH_TYPES.map((type, index) => ({
  value: type,
  text: type,
  selected: index === 0,
}));

let fishingLicenceNumber: string;

export async function fishingLicenceDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { defaultIssueDate, defaultExpiryDate } = getDefaultDates();
    fishingLicenceNumber = "FLN" + getRandomIntInclusive();
    res.render("fishing-licence-document-details-form.njk", {
      defaultIssueDate,
      defaultExpiryDate,
      fishingLicenceNumber,
      fishTypeOptions,
      authenticated: isAuthenticated(req),
      errorChoices: ERROR_CHOICES,
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened rendering Fishing Licence document page",
    );
    res.render("500.njk");
  }
}

export async function fishingLicenceDocumentBuilderPostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const body: FishingLicenceRequestBody = req.body;
    const errors = validateDateFields(body);
    if (!FISH_TYPES.includes(body.type_of_fish)) {
      errors.type_of_fish = "Select a valid type of fish";
    }
    if (Object.keys(errors).length > 0) {
      const { defaultIssueDate, defaultExpiryDate } = getDefaultDates();
      return res.render("fishing-licence-document-details-form.njk", {
        defaultIssueDate,
        defaultExpiryDate,
        fishingLicenceNumber,
        fishTypeOptions,
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
    const data = buildFishingLicenceDataFromRequestBody(body, s3Uri);
    await saveDocument(getDocumentsTableName(), {
      itemId,
      documentId: data.document_number,
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
    logger.error(
      error,
      "An error happened processing Fishing Licence document request",
    );
    res.render("500.njk");
  }
}

function buildFishingLicenceDataFromRequestBody(
  body: FishingLicenceRequestBody,
  s3Uri: string,
): FishingLicenceData {
  const birthDay = body["birth-day"];
  const birthMonth = body["birth-month"];
  const birthYear = body["birth-year"];
  const issueDay = body["issue-day"];
  const issueMonth = body["issue-month"];
  const issueYear = body["issue-year"];
  const expiryDay = body["expiry-day"];
  const expiryMonth = body["expiry-month"];
  const expiryYear = body["expiry-year"];

  return {
    family_name: body.family_name,
    given_name: body.given_name,
    portrait: s3Uri,
    birth_date: formatDate(birthDay, birthMonth, birthYear),
    issue_date: formatDate(issueDay, issueMonth, issueYear),
    expiry_date: formatDate(expiryDay, expiryMonth, expiryYear),
    issuing_country: body.issuing_country,
    document_number: body.document_number,
    type_of_fish: body.type_of_fish,
    number_of_fishing_rods: body.number_of_fishing_rods,
    credentialTtlMinutes: Number(body.credentialTtl),
  };
}
