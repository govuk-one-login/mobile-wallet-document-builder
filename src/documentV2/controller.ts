import { Request, Response } from "express";
import { getDocument } from "../services/databaseService";
import { logger } from "../middleware/logger";
import { getPhoto } from "../services/s3Service";
import { CredentialType } from "../types/CredentialType";
import { getDocumentsV2TableName } from "../config/appConfig";
import { VeteranCardData } from "../veteranCardDocumentBuilder/types/VeteranCardData";
import { TableItemV2 } from "../types/TableItemV2";

export async function documentController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { documentId } = req.params;
    const tableName = getDocumentsV2TableName();
    const tableItem = (await getDocument(tableName, documentId)) as
      | TableItemV2
      | undefined;

    if (!tableItem) {
      logger.error(`Document with ID ${documentId} not found`);
      return res.status(404).send();
    }

    const { data } = tableItem;

    if (tableItem.vcType === CredentialType.digitalVeteranCard) {
      const s3Uri = (data as VeteranCardData).photo;

      const { bucketName, fileName } = getBucketAndFileName(s3Uri);

      const photo = await getPhoto(fileName, bucketName);
      if (!photo) {
        logger.error(`Photo for document with ID ${documentId} not found`);
        return res.status(404).send();
      }
      (data as VeteranCardData).photo = photo;
    }

    return res.status(200).json(tableItem);
  } catch (error) {
    logger.error(error, "An error happened processing request to get document");
    return res.status(500).send();
  }
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
