process.env.ENVIRONMENT = "local";
import { mockClient } from "aws-sdk-client-mock";
import {
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { saveDocument, getDocument } from "../../src/services/databaseService";
import "aws-sdk-client-mock-jest";
import { TableItemV2 } from "../../src/types/TableItemV2";

describe("databaseService.ts", () => {
  const item = {
    documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
    data: {
      title: "Ms",
      givenName: "Rose",
      familyName: "Andrews",
      nino: "QQ123456A",
    },
    vcDataModel: "v2.0",
    vcType: "SocialSecurityCredential",
  } as TableItemV2;

  it("should save a document to the database table", async () => {
    const putItemCommand = {
      TableName: "testTable",
      Item: item,
    };
    const dynamoDbMock = mockClient(DynamoDBDocumentClient);
    dynamoDbMock.on(PutCommand).resolvesOnce({
      $metadata: {
        httpStatusCode: 200,
      },
    });

    await expect(saveDocument("testTable", item)).resolves.not.toThrow();
    expect(dynamoDbMock).toHaveReceivedCommandWith(PutCommand, putItemCommand);
  });

  it("should throw the error thrown by the DynamoDB client when trying to save a document", async () => {
    const putItemCommand = {
      TableName: "testTable",
      Item: item,
    };
    const dynamoDbMock = mockClient(DynamoDBDocumentClient);
    dynamoDbMock.on(PutCommand).rejectsOnce("SOME_DATABASE_ERROR");

    await expect(saveDocument("testTable", item)).rejects.toThrow(
      "SOME_DATABASE_ERROR"
    );
    expect(dynamoDbMock).toHaveReceivedCommandWith(PutCommand, putItemCommand);
  });

  it("should get a document from the database table by documentId and return it", async () => {
    const getCommandInput = {
      TableName: "testTable",
      Key: {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      },
    };
    const databaseMockClient = mockClient(DynamoDBDocumentClient);
    databaseMockClient.on(GetCommand).resolvesOnce({
      $metadata: {
        httpStatusCode: 200,
      },
      Item: item,
    });

    const response = await getDocument(
      "testTable",
      "2e0fac05-4b38-480f-9cbd-b046eabe1e46"
    );

    expect(response).toEqual(item);
    expect(databaseMockClient).toHaveReceivedCommandWith(
      GetCommand,
      getCommandInput
    );
  });

  it("should return 'undefined' if the document does not exist", async () => {
    const databaseMockClient = mockClient(DynamoDBDocumentClient);
    databaseMockClient.on(GetCommand).resolvesOnce({
      $metadata: {
        httpStatusCode: 200,
      },
    });

    const response = await getDocument(
      "testTable",
      "2e0fac05-4b38-480f-9cbd-b046eabe1e46"
    );

    expect(response).toEqual(undefined);
  });

  it("should throw the error thrown by the DyanamoDB client when trying to get a document", async () => {
    const databaseMockClient = mockClient(DynamoDBDocumentClient);
    databaseMockClient.on(GetCommand).rejectsOnce("SOME_ERROR");

    await expect(
      getDocument("testTable", "2e0fac05-4b38-480f-9cbd-b046eabe1e46")
    ).rejects.toThrow("SOME_ERROR");
  });
});
