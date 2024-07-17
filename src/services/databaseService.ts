import { getDocumentsTableName } from "../config/appConfig";
import { getDatabaseConfig } from "../config/aws";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { DbsDocument } from "../dbsDocumentBuilder/models/dbsDocument";
import { NinoDocument } from "../ninoDocumentBuilder/models/ninoDocument";
import { UUID } from "node:crypto";
import { logger } from "../middleware/logger";

const dynamoDbClient = new DynamoDBClient(getDatabaseConfig());
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);

export async function saveDocument(
  document: DbsDocument | NinoDocument,
  documentId: UUID,
): Promise<void> {
  const tableName = getDocumentsTableName();

  const command = new PutCommand({
    TableName: tableName,
    Item: {
      documentId: documentId,
      vc: JSON.stringify(document),
    },
  });

  try {
    await documentClient.send(command);
    logger.info(`Document with documentId ${documentId} saved to database`);
  } catch (error) {
    logger.error(
      `Failed to save to database document with documentId ${documentId}`
    );
    throw error;
  }
}

export async function getDocument(
  documentId: string
): Promise<Record<string, unknown> | undefined> {
  const tableName = getDocumentsTableName();

  const command = new GetCommand({
    TableName: tableName,
    Key: {
      documentId,
    },
  });

  try {
    const { Item } = await documentClient.send(command);

    if (!Item) {
      logger.error(`Document with documentId ${documentId} not found`);
      return undefined;
    }

    return Item;
  } catch (error) {
    logger.error(
      `Failed to get from database document with documentId ${documentId}`
    );
    throw error;
  }
}
