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
import { ExampleDocumentRequestBody } from "./types/ExampleDocumentRequestBody";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { ExampleDocumentData } from "./types/ExampleDocumentData";
import { isErrorCode } from "../utils/isErrorCode";
import { getRandomIntInclusive } from "../utils/getRandomIntInclusive";

const CREDENTIAL_TYPE = CredentialType.ExampleDocument;
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

let exampleDocumentNumber: string;

export async function exampleDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { defaultIssueDate, defaultExpiryDate } = getDefaultDates();
    exampleDocumentNumber = "FLN" + getRandomIntInclusive();
    res.render("example-document-details-form.njk", {
      defaultIssueDate,
      defaultExpiryDate,
      exampleDocumentNumber,
      fishTypeOptions,
      authenticated: isAuthenticated(req),
      errorChoices: ERROR_CHOICES,
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened rendering the Example Document page",
    );
    res.render("500.njk");
  }
}

export async function exampleDocumentBuilderPostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const body: ExampleDocumentRequestBody = req.body;
    const errors = validateDateFields(body);
    if (!FISH_TYPES.includes(body.type_of_fish)) {
      errors.type_of_fish = "Select a valid type of fish";
    }
    if (Object.keys(errors).length > 0) {
      const { defaultIssueDate, defaultExpiryDate } = getDefaultDates();
      return res.render("example-document-details-form.njk", {
        defaultIssueDate,
        defaultExpiryDate,
        exampleDocumentNumber,
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
    const data = buildExampleDocumentDataFromRequestBody(body, s3Uri);
    await saveDocument(getDocumentsTableName(), {
      itemId,
      documentId: data.document_number,
      data,
      vcType: CREDENTIAL_TYPE,
      credentialTtlMinutes: Number(body.credentialTtl),
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
      "An error happened processing the Example Document request",
    );
    res.render("500.njk");
  }
}

function buildExampleDocumentDataFromRequestBody(
  body: ExampleDocumentRequestBody,
  s3Uri: string,
): ExampleDocumentData {
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
  };
}
