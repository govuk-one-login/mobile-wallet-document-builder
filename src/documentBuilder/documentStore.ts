import { getDocumentsTableName } from "../config/appConfig";
import { getDatabaseConfig } from "../config/aws";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Document } from "./documentBuilder";
import { UUID } from "node:crypto";

const dynamoDbClient = new DynamoDBClient(getDatabaseConfig());
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);

export async function saveDocument(
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
