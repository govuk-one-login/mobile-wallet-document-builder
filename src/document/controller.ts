import { Request, Response } from "express";
import { getDocument } from "../services/databaseService";
import { logger } from "../middleware/logger";
import { getPhoto } from "../services/s3Service";
import { CredentialType } from "../types/CredentialType";
import { getDocumentsTableName } from "../config/appConfig";
import { VeteranCardData } from "../veteranCardDocumentBuilder/types/VeteranCardData";
import {MdlData} from "../mdlDocumentBuilder/types/MdlData";

export async function documentController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { documentId } = req.params;
    const tableName = getDocumentsTableName();
    const tableItem = await getDocument(tableName, documentId);

    if (!tableItem) {
      logger.error(`Document with ID ${documentId} not found`);
      res.status(404).send();
      return;
    }

    const { data } = tableItem;

    if (tableItem.vcType === CredentialType.digitalVeteranCard) {
      const s3Uri = (data as VeteranCardData).photo;

      const { bucketName, fileName } = getBucketAndFileName(s3Uri);

      const photo = await getPhoto(fileName, bucketName);
      if (!photo) {
        logger.error(`Photo for document with ID ${documentId} not found`);
        res.status(404).send();
        return;
      }
      (data as VeteranCardData).photo = photo;
    }

    if (tableItem.vcType === CredentialType.mobileDrivingLicense) {
      const s3Uri = (data as MdlData).portrait;

      const { bucketName, fileName } = getBucketAndFileName(s3Uri);

      const photo = await getPhoto(fileName, bucketName);
      if (!photo) {
        logger.error(`Photo for document with ID ${documentId} not found`);
        res.status(404).send();
        return;
      }
      (data as MdlData).portrait = photo;
    }

    res.status(200).json(tableItem);
    return;
  } catch (error) {
    logger.error(error, "An error happened processing request to get document");
    res.status(500).send();
    return;
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
