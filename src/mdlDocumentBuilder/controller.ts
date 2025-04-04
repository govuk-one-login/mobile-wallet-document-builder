import { Request, Response } from "express";
import {
  getDocumentsTableName,
  getPhotosBucketName,
} from "../config/appConfig";
import { CredentialType } from "../types/CredentialType";
import { isAuthenticated } from "../utils/isAuthenticated";
import { logger } from "../middleware/logger";
import path from "path";
import { readFileSync } from "fs";
import { randomUUID } from "node:crypto";
import { uploadPhoto } from "../services/s3Service";
import { MdlData } from "./types/MdlData";
import { MdlRequestBody } from "./types/MdlRequestBody";
import { saveDocument } from "../services/databaseService";

const CREDENTIAL_TYPE = CredentialType.mobileDrivingLicense;
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".jfif": "image/jpeg",
};

export async function mdlDocumentBuilderGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    res.render("mdl-document-details-form.njk", {
      authenticated: isAuthenticated(req),
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened rendering Driving License document page",
    );
    res.render("500.njk");
  }
}

export async function mdlDocumentBuilderPostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { photoBuffer, mimeType } = getPhoto(req.body.portrait);
    const bucketName = getPhotosBucketName();
    const documentId = randomUUID();
    await uploadPhoto(photoBuffer, documentId, bucketName, mimeType);
    const s3Uri = `s3://${bucketName}/${documentId}`;
    const body: MdlRequestBody = req.body;
    const data = buildMdlDataFromRequestBody(body, s3Uri);

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
      "An error happened processing Driving License document request",
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

function buildMdlDataFromRequestBody(body: MdlRequestBody, s3Uri: string) {
  const { throwError: _throwError, ...newObject } = body;
  const data: MdlData = { ...newObject, portrait: s3Uri };
  return data;
}
