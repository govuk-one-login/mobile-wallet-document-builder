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
import { isErrorCode } from "../utils/isErrorCode";
import { ERROR_CHOICES } from "../utils/errorChoices";
import { getTimeToLiveEpoch } from "../utils/getTimeToLiveEpoch";

const CREDENTIAL_TYPE = CredentialType.DigitalVeteranCard;
const TTL_MINUTES = 43200;

export async function veteranCardDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    res.render("veteran-card-document-details-form.njk", {
      authenticated: isAuthenticated(req),
      errorChoices: ERROR_CHOICES,
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
    const { photoBuffer, mimeType } = getPhoto(body.photo);

    const bucketName = getPhotosBucketName();
    const itemId = randomUUID();
    await uploadPhoto(photoBuffer, itemId, bucketName, mimeType);

    const s3Uri = `s3://${bucketName}/${itemId}`;
    const data = buildVeteranCardDataFromRequestBody(body, s3Uri);
    const timeToLive = getTimeToLiveEpoch(TTL_MINUTES);

    await saveDocument(getDocumentsTableName(), {
      itemId,
      documentId: data.serviceNumber,
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

  const data: VeteranCardData = {
    ...newObject,
    photo: s3Uri,
  };

  return data;
}
