import {Request, Response} from "express";
import {randomUUID} from "node:crypto";
import {saveDocument} from "../services/databaseService";
import {CredentialType} from "../types/CredentialType";
import {logger} from "../middleware/logger";
import {isAuthenticated} from "../utils/isAuthenticated";
import {uploadPhoto} from "../services/s3Service";
import {getDocumentsTableName, getPhotosBucketName,} from "../config/appConfig";
import {VeteranCardData} from "./types/VeteranCardData";
import {VeteranCardRequestBody} from "./types/VeteranCardRequestBody";
import {getPhoto} from "../utils/photoUtils";
import {getCredentialTtl} from "../utils/CredentialTtl";

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
    const { photoBuffer, mimeType } = getPhoto(req.body.photo);
    const bucketName = getPhotosBucketName();
    const documentId = randomUUID();
    await uploadPhoto(photoBuffer, documentId, bucketName, mimeType);
    const s3Uri = `s3://${bucketName}/${documentId}`;
    const body: VeteranCardRequestBody = req.body;
    const credentialTtlMinutes = getCredentialTtl(body.credentialTtl);

    const data = buildVeteranCardDataFromRequestBody(body, s3Uri, credentialTtlMinutes);
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

function buildVeteranCardDataFromRequestBody(body: VeteranCardRequestBody, s3Uri: string, credentialTtlMinutes: number) {
  const {
    throwError: _throwError,
    ...newObject
  } = body;

  const data: VeteranCardData = {
    ...newObject,
    credentialTtlMinutes: credentialTtlMinutes,
    photo: s3Uri
  };

  return data;
}
