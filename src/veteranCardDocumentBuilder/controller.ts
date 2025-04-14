import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { uploadPhoto } from "../services/s3Service";
import {
  getDocumentsTableName,
  getPhotosBucketName,
} from "../config/appConfig";
import { VeteranCardData } from "./types/VeteranCardData";
import { VeteranCardRequestBody } from "./types/VeteranCardRequestBody";
import { getPhoto } from "../utils/photoUtils";

const CREDENTIAL_TYPE = CredentialType.digitalVeteranCard;

export async function veteranCardDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    res.render("veteran-card-document-details-form.njk", {
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened rendering Veteran Card document page",
    );
    res.render("500.njk");
  }
}

export async function veteranCardDocumentBuilderPostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const body: VeteranCardRequestBody = req.body;
    if (
      !isValidDate(
        body["dateOfBirth-day"],
        body["dateOfBirth-month"],
        body["dateOfBirth-year"],
      )
    ) {
      res.render("veteran-card-document-details-form.njk", {
        errors: {
          ["date-of-birth"]: "Enter a valid date",
        },
        authenticated: isAuthenticated(req),
      });
      return;
    }
    const { photoBuffer, mimeType } = getPhoto(req.body.photo);
    const bucketName = getPhotosBucketName();
    const documentId = randomUUID();
    await uploadPhoto(photoBuffer, documentId, bucketName, mimeType);

    const s3Uri = `s3://${bucketName}/${documentId}`;
    const data = buildVeteranCardDataFromRequestBody(body, s3Uri);
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
      "An error happened processing Veteran Card document request",
    );
    res.render("500.njk");
  }
}

function buildVeteranCardDataFromRequestBody(
  body: VeteranCardRequestBody,
  s3Uri: string,
) {
  const { throwError: _throwError, ...newObject } = body;
  const data: VeteranCardData = { ...newObject, photo: s3Uri };
  return data;
}

function isValidDate(dayInput: string, monthInput: string, yearInput: string) {
  if (isEmpty(dayInput) || isEmpty(monthInput) || isEmpty(yearInput)) {
    return false;
  }

  if (
    !/^[0-9]{1,2}$/.test(dayInput) ||
    !/^[0-9]{1,2}$/.test(monthInput) ||
    !/^[0-9]+$/.test(yearInput)
  ) {
    return false;
  }

  if (!/^[1-9][0-9]{3}$/.test(yearInput)) {
    return false;
  }

  const day = parseInt(dayInput, 10);
  const month = parseInt(monthInput, 10);
  const year = parseInt(yearInput, 10);

  // JavaScript months are 0-indexed (0 = January, 11 = December)
  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) {
    return false;
  }

  // Check if the date object contains the same values passed in
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isEmpty(input: string) {
  return input === "";
}

// function notValid(message: string) {
//   return {
//     valid: false,
//     message
//   }
// }
//
// function valid() {
//   return {
//     valid: true,
//   }
// }
