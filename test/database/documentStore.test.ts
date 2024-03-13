process.env.DOCUMENTS_TABLE_NAME = "testTable";
import { mockClient } from "aws-sdk-client-mock";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { saveDocument } from "../../src/database/documentStore";
import "aws-sdk-client-mock-jest";

import { Document } from "../../src/documentBuilder/documentBuilder";

describe("saveDocument", () => {
  it("should save a document to the DynamoDB table", async () => {
    const document = {
      type: "testType",
      credentialSubject: "testCredentialSubject",
    } as unknown as Document;

    const putItemCommand = {
      TableName: "testTable",
      Item: {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        walletSubjectId: "testSubject",
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
      saveDocument(document, "2e0fac05-4b38-480f-9cbd-b046eabe1e46")
    ).resolves.not.toThrow();
    expect(dynamoDbMock).toHaveReceivedCommandWith(PutCommand, putItemCommand);
  });

  it("should throw a DYNAMODB_ERROR error", async () => {
    const document = {
      type: "testType",
      credentialSubject: "testCredentialSubject",
    } as unknown as Document;

    const putItemCommand = {
      TableName: "testTable",
      Item: {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        walletSubjectId: "testSubject",
        vc: JSON.stringify(document),
      },
    };

    const dynamoDbMock = mockClient(DynamoDBDocumentClient);
    dynamoDbMock.on(PutCommand).rejectsOnce("DYNAMODB_ERROR");

    await expect(
      saveDocument(document, "2e0fac05-4b38-480f-9cbd-b046eabe1e46")
    ).rejects.toThrow("DYNAMODB_ERROR");
    expect(dynamoDbMock).toHaveReceivedCommandWith(PutCommand, putItemCommand);
  });
});
