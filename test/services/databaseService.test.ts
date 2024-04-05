process.env.DOCUMENTS_TABLE_NAME = "testTable";
process.env.ENVIRONMENT = "local";
import { mockClient } from "aws-sdk-client-mock";
import {
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { saveDocument, getDocument } from "../../src/services/databaseService";
import "aws-sdk-client-mock-jest";

describe("databaseService.ts", () => {
  it("should save a document to the database table", async () => {
    const document = {
      credentialSubject: {
        name: [
          {
            nameParts: [
              { type: "Title", value: "Ms" },
              { type: "GivenName", value: "Irene" },
              { type: "FamilyName", value: "Adler" },
            ],
          },
        ],
        socialSecurityRecord: [{ personalNumber: "QQ123456A" }],
      },
      type: ["VerifiableCredential", "SocialSecurityCredential"],
    };
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

  it("should throw an error caught when trying to save a document", async () => {
    const document = {
      credentialSubject: {
        name: [
          {
            nameParts: [
              { type: "Title", value: "Ms" },
              { type: "GivenName", value: "Irene" },
              { type: "FamilyName", value: "Adler" },
            ],
          },
        ],
        socialSecurityRecord: [{ personalNumber: "QQ123456A" }],
      },
      type: ["VerifiableCredential", "SocialSecurityCredential"],
    };
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

  it("should get a document from the database table by documentId and return it", async () => {
    const document = {
      credentialSubject: {
        name: [
          {
            nameParts: [
              { type: "Title", value: "Ms" },
              { type: "GivenName", value: "Irene" },
              { type: "FamilyName", value: "Adler" },
            ],
          },
        ],
        socialSecurityRecord: [{ personalNumber: "QQ123456A" }],
      },
      type: ["VerifiableCredential", "SocialSecurityCredential"],
    };
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
      Item: {
        vc: JSON.stringify(document),
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        walletSubjectId: "testWalletSubjectId",
      },
    });

    const response = await getDocument("2e0fac05-4b38-480f-9cbd-b046eabe1e46");

    expect(response).toEqual({
      vc: JSON.stringify(document),
      documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      walletSubjectId: "testWalletSubjectId",
    });
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

    const response = await getDocument("2e0fac05-4b38-480f-9cbd-b046eabe1e46");

    expect(response).toEqual(undefined);
  });

  it("should throw an error caught when trying to get a document", async () => {
    const databaseMockClient = mockClient(DynamoDBDocumentClient);
    databaseMockClient.on(GetCommand).rejectsOnce("SOME_ERROR");

    await expect(
      getDocument("2e0fac05-4b38-480f-9cbd-b046eabe1e46")
    ).rejects.toThrow("SOME_ERROR");
  });
});
