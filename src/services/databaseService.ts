import { getDatabaseConfig } from "../config/aws";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { logger } from "../middleware/logger";
import {TableItemV1} from "../types/TableItemV1";
import {TableItemV2} from "../types/TableItemV2";

const dynamoDbClient = new DynamoDBClient(getDatabaseConfig());
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);

export async function saveDocument(
  tableName: string, item: TableItemV1 | TableItemV2
): Promise<void> {

  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });

    await documentClient.send(command);
}

export async function getDocument(
    tableName: string,
    documentId: string,
): Promise<TableItemV1 | TableItemV2 | undefined> {

  const command = new GetCommand({
    TableName: tableName,
    Key: {
      documentId,
    },
  });

  const { Item } = await documentClient.send(command);

  if (!Item) {
    logger.error(`Document with documentId ${documentId} not found`);
    return undefined;
  }
  return Item as TableItemV1 | TableItemV2;

}
