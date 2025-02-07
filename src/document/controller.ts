import { Request, Response } from "express";
import { getDocument } from "../services/databaseService";
import { logger } from "../middleware/logger";
import { NinoDocument } from "../ninoDocumentBuilder/models/ninoDocument";
import { DbsDocument } from "../dbsDocumentBuilder/models/dbsDocument";
import { VeteranCardDocument } from "../veteranCardDocumentBuilder/models/veteranCardDocument";
import { getPhoto } from "../services/s3Service";
import { CredentialType } from "../types/CredentialType";
import { getDocumentsTableName } from "../config/appConfig";
import { TableItemV1 } from "../types/TableItemV1";

export async function documentController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { documentId } = req.params;
    const tableName = getDocumentsTableName();
    const databaseItem = (await getDocument(tableName, documentId)) as
      | TableItemV1
      | undefined;

    if (!databaseItem) {
      logger.error(`Document with ID ${documentId} not found`);
      return res.status(404).send();
    }
    const documentString = databaseItem.vc as string;
    const document: NinoDocument | DbsDocument | VeteranCardDocument =
      JSON.parse(documentString);

    if (isDigitalVeteranCard(document)) {
      const s3Uri = (document as VeteranCardDocument).credentialSubject
        .veteranCard[0].photo;

      const { bucketName, fileName } = getBucketAndFileName(s3Uri);

      const photo = await getPhoto(fileName, bucketName);
      if (!photo) {
        logger.error(`Photo for document with ID ${documentId} not found`);
        return res.status(404).send();
      }
      (document as VeteranCardDocument).credentialSubject.veteranCard[0].photo =
        photo;
    }

    return res.status(200).json(document);
  } catch (error) {
    logger.error(error, "An error happened processing request to get document");
    return res.status(500).send();
  }
}

function isDigitalVeteranCard(
  document: NinoDocument | DbsDocument | VeteranCardDocument
) {
  return document.type.includes(CredentialType.digitalVeteranCard);
}

function getBucketAndFileName(s3Uri: string): {
  bucketName: string;
  fileName: string;
} {
  const s3UriParts = s3Uri.split("/");
  const bucketName = s3UriParts[2];
  const fileName = s3UriParts[3];
  return { bucketName, fileName };
}
