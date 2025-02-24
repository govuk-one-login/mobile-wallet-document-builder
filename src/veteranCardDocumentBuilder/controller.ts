import { Request, Response } from "express";
import { VeteranCardDocument } from "./models/veteranCardDocument";
import { randomUUID } from "node:crypto";
import { saveDocument } from "../services/databaseService";
import { CredentialType } from "../types/CredentialType";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { readFileSync } from "fs";
import path from "path";
import { uploadPhoto } from "../services/s3Service";
import {
  getDocumentsTableName,
  getDocumentsV2TableName,
  getPhotosBucketName,
} from "../config/appConfig";
import { VeteranCardData } from "./types/VeteranCardData";
import { VeteranCardRequestBody } from "./types/VeteranCardRequestBody";

const CREDENTIAL_TYPE = CredentialType.digitalVeteranCard;

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".jfif": "image/png",
};

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

    const document = VeteranCardDocument.fromRequestBody(
      body,
      CREDENTIAL_TYPE,
      s3Uri,
    );
    await saveDocument(getDocumentsTableName(), {
      documentId,
      vc: JSON.stringify(document),
    }); //v1

    const data = buildVeteranCardDataFromRequestBody(body, s3Uri);
    await saveDocument(getDocumentsV2TableName(), {
      documentId,
      data,
      vcDataModel: req.cookies["dataModel"],
      vcType: CREDENTIAL_TYPE,
    }); //v2

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

interface Photo {
  photoBuffer: Buffer<ArrayBufferLike>;
  mimeType: string;
}

function getPhoto(selectedPhoto: string): Photo {
  const filePath = path.resolve(__dirname, "../resources", selectedPhoto);
  const photoBuffer = readFileSync(filePath);
  const ext = path.extname(selectedPhoto);
  const mimeType = MIME_TYPES[ext];
  return { photoBuffer, mimeType };
}

function buildVeteranCardDataFromRequestBody(
  body: VeteranCardRequestBody,
  s3Uri: string,
) {
  const { throwError: _throwError, ...newObject } = body;
  const data: VeteranCardData = { ...newObject, photo: s3Uri };
  return data;
}
