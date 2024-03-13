process.env.DOCUMENTS_TABLE_NAME = "testTable";
import { mockClient } from "aws-sdk-client-mock";
import {
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  getDocumentFromDatabase,
  saveDocumentToDatabase,
} from "../../src/database/documentStore";
import "aws-sdk-client-mock-jest";

import { Document } from "../../src/documentBuilder/documentBuilder";

describe("documentStore.ts", () => {
  describe("saveDocument", () => {
    it("should save a document to the database table", async () => {
      const document = {
        type: "testType",
        credentialSubject: "testCredentialSubject",
      } as unknown as Document;
      const putCommandInput = {
        TableName: "testTable",
        Item: {
          documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          walletSubjectId: "testSubject",
          vc: JSON.stringify(document),
        },
      };

      const databaseMockClient = mockClient(DynamoDBDocumentClient);
      databaseMockClient.on(PutCommand).resolvesOnce({
        $metadata: {
          httpStatusCode: 200,
        },
      });

      await expect(
        saveDocumentToDatabase(document, "2e0fac05-4b38-480f-9cbd-b046eabe1e46")
      ).resolves.not.toThrow();
      expect(databaseMockClient).toHaveReceivedCommandWith(
        PutCommand,
        putCommandInput
      );
    });

    it("should throw an error caught when trying to save a document", async () => {
      const document = {
        type: "testType",
        credentialSubject: "testCredentialSubject",
      } as unknown as Document;

      const databaseMockClient = mockClient(DynamoDBDocumentClient);
      databaseMockClient.on(PutCommand).rejectsOnce("SOME_ERROR");

      await expect(
        saveDocumentToDatabase(document, "2e0fac05-4b38-480f-9cbd-b046eabe1e46")
      ).rejects.toThrow("SOME_ERROR");
    });
  });

  describe("getDocument", () => {
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
        Item: {
          vc: JSON.stringify({
            type: "testType",
            credentialSubject: "testCredentialSubject",
          }),
          documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          walletSubjectId: "testWalletSubjectId",
        },
      });

      const response = await getDocumentFromDatabase(
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46"
      );

      expect(response).toEqual({
        vc: '{"type":"testType","credentialSubject":"testCredentialSubject"}',
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

      const response = await getDocumentFromDatabase(
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46"
      );

      expect(response).toEqual(undefined);
    });

    it("should throw an error caught when trying to get a document", async () => {
      const databaseMockClient = mockClient(DynamoDBDocumentClient);
      databaseMockClient.on(GetCommand).rejectsOnce("SOME_ERROR");

      await expect(
        getDocumentFromDatabase("2e0fac05-4b38-480f-9cbd-b046eabe1e46")
      ).rejects.toThrow("SOME_ERROR");
    });
  });
});
