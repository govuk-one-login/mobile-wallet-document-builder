process.env.DOCUMENTS_TABLE_NAME = "testTable";
process.env.ENVIRONMENT = "local";
import { mockClient } from "aws-sdk-client-mock";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { saveDocument } from "../../../src/documentBuilder/services/databaseService";
import "aws-sdk-client-mock-jest";
import { Document } from "../../../src/documentBuilder/models/documentBuilder";

describe("saveDocument", () => {
  it("should save a document to the database table", async () => {
    const document = {
      type: "testType",
      credentialSubject: "testCredentialSubject",
    } as unknown as Document;

    const putItemCommand = {
      TableName: "testTable",
      Item: {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        walletSubjectId: "walletSubjectIdPlaceholder",
        vc: JSON.stringify(document),
      },
    };

    const dynamoDbMock = mockClient(DynamoDBDocumentClient);
    dynamoDbMock.on(PutCommand).resolvesOnce({
      $metadata: {
        httpStatusCode: 200,
      },
    });

    await expect(
      saveDocument(
        document,
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        "walletSubjectIdPlaceholder"
      )
    ).resolves.not.toThrow();
    expect(dynamoDbMock).toHaveReceivedCommandWith(PutCommand, putItemCommand);
  });

  it("should throw a SOME_DATABASE_ERROR error", async () => {
    const document = {
      type: "testType",
      credentialSubject: "testCredentialSubject",
    } as unknown as Document;

    const putItemCommand = {
      TableName: "testTable",
      Item: {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        walletSubjectId: "walletSubjectIdPlaceholder",
        vc: JSON.stringify(document),
      },
    };

    const dynamoDbMock = mockClient(DynamoDBDocumentClient);
    dynamoDbMock.on(PutCommand).rejectsOnce("SOME_DATABASE_ERROR");

    await expect(
      saveDocument(
        document,
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        "walletSubjectIdPlaceholder"
      )
    ).rejects.toThrow("SOME_DATABASE_ERROR");
    expect(dynamoDbMock).toHaveReceivedCommandWith(PutCommand, putItemCommand);
  });
});
