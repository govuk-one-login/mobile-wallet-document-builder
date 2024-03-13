import {
  documentBuilderGet,
  documentBuilderPost,
} from "../../src/documentBuilder/controller";
import { Document } from "../../src/documentBuilder/documentBuilder";
import * as documentStore from "../../src/documentBuilder/documentStore";
import * as credentialOffer from "../../src/documentBuilder/credentialOffer";
import { Request, Response } from "express";
import QRCode from "qrcode";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("2e0fac05-4b38-480f-9cbd-b046eabe1e46"),
}));
jest.mock("../../src/documentBuilder/documentBuilder");
jest.mock("../../src/documentBuilder/documentStore", () => ({
  saveDocument: jest.fn(),
}));
jest.mock("../../src/documentBuilder/credentialOffer", () => ({
  getCredentialOffer: jest.fn(),
}));
jest.mock("qrcode");

describe("controller.ts", () => {
  describe("documentBuilderGet", () => {
    it("should render the form page for inputting document details", async () => {
      const request = {} as Request;
      const response = { render: jest.fn() } as unknown as Response;

      await documentBuilderGet(request, response);

      expect(response.render).toHaveBeenCalledWith("document-form.njk");
    });
  });

  describe("documentBuilderPost", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const mockedQrCode = QRCode as jest.Mocked<typeof QRCode>;
    const saveDocument = documentStore.saveDocument as jest.Mock;
    const getCredentialOffer = credentialOffer.getCredentialOffer as jest.Mock;

    it("should render the credential offer", async () => {
      const request = {
        body: {
          title: "Ms",
          givenName: "Irene",
          familyName: "Adler",
          nino: "QQ123456A",
        },
      } as unknown as Request;
      const response = { render: jest.fn() } as unknown as Response;
      const document = {
        type: "testType",
        credentialSubject: "testCredentialSubject",
      } as unknown as Document;
      const credentialOfferMocked = {
        credential_offer_uri:
          "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer",
      };
      const qrCode =
        "data:image/png;base64,iVBORw0KGgoAAAANSU" as unknown as void;

      mockedQrCode.toDataURL.mockReturnValueOnce(qrCode);
      jest.spyOn(Document, "fromRequestBody").mockReturnValueOnce(document);
      getCredentialOffer.mockReturnValueOnce(credentialOfferMocked);

      await documentBuilderPost(request, response);

      expect(Document.fromRequestBody).toHaveBeenCalledWith(request.body);
      expect(saveDocument).toHaveBeenCalledWith(
        {
          type: "testType",
          credentialSubject: "testCredentialSubject",
        },
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        "walletSubjectIdPlaceholder"
      );
      expect(getCredentialOffer).toHaveBeenCalledWith(
        "walletSubjectIdPlaceholder",
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46"
      );
      expect(response.render).toHaveBeenCalledWith("credential-offer.njk", {
        qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSU",
        universalLink:
          "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer",
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      });
    });

    it("should throw a DYNAMODB_ERROR error", async () => {
      const request = {
        body: {
          title: "Ms",
          givenName: "Irene",
          familyName: "Adler",
          nino: "QQ123456A",
        },
      } as unknown as Request;
      const response = { render: jest.fn() } as unknown as Response;
      const document = {
        type: "testType",
        credentialSubject: "testCredentialSubject",
      } as unknown as Document;

      jest.spyOn(Document, "fromRequestBody").mockReturnValueOnce(document);
      saveDocument.mockRejectedValueOnce(new Error("DYNAMODB_ERROR"));

      await expect(documentBuilderPost(request, response)).rejects.toThrow(
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
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        "walletSubjectIdPlaceholder"
      );
      expect(getCredentialOffer).not.toHaveBeenCalled();
      expect(response.render).not.toHaveBeenCalled();
    });
  });
});
