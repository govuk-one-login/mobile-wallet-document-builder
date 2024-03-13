import {
  documentBuilderGet,
  documentBuilderPost,
} from "../../src/documentBuilder/controller";
import { Document } from "../../src/documentBuilder/documentBuilder";
import * as documentStore from "../../src/database/documentStore";
import { Request, Response } from "express";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("2e0fac05-4b38-480f-9cbd-b046eabe1e46"),
}));
jest.mock("../../src/documentBuilder/documentBuilder");
jest.mock("../../src/database/documentStore", () => ({
  saveDocumentToDatabase: jest.fn(),
}));

describe("controller.ts", () => {
  describe("documentBuilderGet", () => {
    it("should render the form page for inputting document details", async () => {
      const req = {} as Request;
      const res = { render: jest.fn() } as unknown as Response;

      await documentBuilderGet(req, res);

      expect(res.render).toHaveBeenCalledWith("document-form.njk");
    });
  });

  describe("documentBuilderPost", () => {
    it("should render the document ID", async () => {
      const req = {
        body: {
          title: "Ms",
          givenName: "Irene",
          familyName: "Adler",
          nino: "QQ123456A",
        },
      } as unknown as Request;

      const res = { render: jest.fn() } as unknown as Response;

      const document = {
        type: "testType",
        credentialSubject: "testCredentialSubject",
      } as unknown as Document;

      jest.spyOn(Document, "fromRequestBody").mockReturnValue(document);
      const saveDocument = documentStore.saveDocumentToDatabase as jest.Mock;

      await documentBuilderPost(req, res);

      expect(Document.fromRequestBody).toHaveBeenCalledWith({
        title: "Ms",
        givenName: "Irene",
        familyName: "Adler",
        nino: "QQ123456A",
      });
      expect(saveDocument).toHaveBeenCalledWith(
        { credentialSubject: "testCredentialSubject", type: "testType" },
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46"
      );
      expect(res.render).toHaveBeenCalledWith("document-id.njk", {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      });
    });

    it("should throw a DYNAMODB_ERROR error", async () => {
      const req = {
        body: {
          title: "Ms",
          givenName: "Irene",
          familyName: "Adler",
          nino: "QQ123456A",
        },
      } as unknown as Request;

      const res = { render: jest.fn() } as unknown as Response;

      const document = {
        type: "testType",
        credentialSubject: "testCredentialSubject",
      } as unknown as Document;

      jest.spyOn(Document, "fromRequestBody").mockReturnValue(document);
      const saveDocument = documentStore.saveDocumentToDatabase as jest.Mock;
      saveDocument.mockRejectedValueOnce(new Error("DYNAMODB_ERROR"));

      await expect(documentBuilderPost(req, res)).rejects.toThrow(
        "DYNAMODB_ERROR"
      );

      expect(Document.fromRequestBody).toHaveBeenCalledWith({
        title: "Ms",
        givenName: "Irene",
        familyName: "Adler",
        nino: "QQ123456A",
      });
      expect(saveDocument).toHaveBeenCalledWith(
        { credentialSubject: "testCredentialSubject", type: "testType" },
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46"
      );
      expect(res.render).not.toHaveBeenCalled();
    });
  });
});
