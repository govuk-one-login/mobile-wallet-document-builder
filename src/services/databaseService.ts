import { getDocumentsTableName } from "../config/appConfig";
import { getDatabaseConfig } from "../config/aws";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { Document } from "../documentBuilder/models/documentBuilder";
import { UUID } from "node:crypto";

const dynamoDbClient = new DynamoDBClient(getDatabaseConfig());
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);

export async function saveDocument(
  document: Document,
  documentId: UUID,
  walletSubjectId: string
): Promise<void> {
  const tableName = getDocumentsTableName();

  const command = new PutCommand({
    TableName: tableName,
    Item: {
      documentId: documentId,
      walletSubjectId: walletSubjectId,
      vc: JSON.stringify(document),
    },
  });

  try {
    const response = await documentClient.send(command);
    console.log(`Document saved: ${JSON.stringify(response)}`);
  } catch (error) {
    console.log(`Failed to save document: ${error}`);
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
      console.log(`No document found for documentID ${documentId}`);
      return undefined;
    }

    return Item;
  } catch (error) {
    console.log(
      `Failed to get document with documentID ${documentId}: ${error}`
    );
    throw error;
  }
}
