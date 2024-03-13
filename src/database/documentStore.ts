import { getDocumentsTableName } from "../config/appConfig";
import { getDatabaseConfig } from "../config/aws";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

import { Document } from "../documentBuilder/documentBuilder";
import { UUID } from "node:crypto";

const dynamoDbClient = new DynamoDBClient(getDatabaseConfig());
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);

export async function saveDocumentToDatabase(
  document: Document,
  documentId: UUID
): Promise<void> {
  console.log("saveDocument");

  const tableName = getDocumentsTableName();

  const command = new PutCommand({
    TableName: tableName,
    Item: {
      documentId: documentId,
      walletSubjectId: "testSubject",
      vc: JSON.stringify(document),
    },
  });

  try {
    const response = await documentClient.send(command);
    console.log(`Document saved: ${JSON.stringify(response)}`);
  } catch (error) {
    console.log(`Failed to save document: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function getDocumentFromDatabase(
  documentId: string
): Promise<Record<string, unknown> | undefined> {
  console.log("getDocument");

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
      console.log("No document found");
      return undefined;
    }

    console.log(`Document found: ${JSON.stringify(Item)}`);
    return Item;
  } catch (error) {
    console.log(`Failed to get document: ${JSON.stringify(error)}`);
    throw error;
  }
}
