import { readFileSync } from "fs";

process.env.PHOTOS_BUCKET_NAME = "photosBucket";
process.env.ENVIRONMENT = "local";
process.env.DOCUMENTS_TABLE_NAME = "testTable";
process.env.DOCUMENTS_V2_TABLE_NAME = "testTable2";
import {
  veteranCardDocumentBuilderGetController,
  veteranCardDocumentBuilderPostController,
} from "../../src/veteranCardDocumentBuilder/controller";
import { VeteranCardDocument } from "../../src/veteranCardDocumentBuilder/models/veteranCardDocument";
import * as databaseService from "../../src/services/databaseService";
import * as s3Service from "../../src/services/s3Service";
import { getMockReq, getMockRes } from "@jest-mock/express";
import path from "path";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("2e0fac05-4b38-480f-9cbd-b046eabe1e46"),
}));
jest.mock("../../src/services/databaseService", () => ({
  saveDocument: jest.fn(),
}));
jest.mock("../../src/services/s3Service", () => ({
  uploadPhoto: jest.fn(),
}));
jest.mock("fs");

const saveDocument = databaseService.saveDocument as jest.Mock;
const uploadPhoto = s3Service.uploadPhoto as jest.Mock;

const requestBody = {
  givenName: "Sarah Elizabeth",
  familyName: "Edwards-Smith",
  "dateOfBirth-day": "06",
  "dateOfBirth-month": "03",
  "dateOfBirth-year": "1975",
  "cardExpiryDate-day": "08",
  "cardExpiryDate-month": "04",
  "cardExpiryDate-year": "2029",
  serviceNumber: "25057386",
  serviceBranch: "HM Naval Service",
  throwError: "",
};

const veteranCardDocument = {
  type: ["VerifiableCredential", "digitalVeteranCard"],
  credentialSubject: {
    name: [
      {
        nameParts: [
          {
            value: "Sarah",
            type: "GivenName",
          },
          {
            value: "Elizabeth",
            type: "GivenName",
          },
          {
            value: "Edwards-Smith",
            type: "FamilyName",
          },
        ],
      },
    ],
    birthDate: [
      {
        value: "1975-03-06",
      },
    ],
    veteranCard: [
      {
        expiryDate: "2029-04-08",
        serviceNumber: "25057386",
        serviceBranch: "HM Naval Service",
        photo: "s3://photosBucket/2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      },
    ],
  },
};

jest
  .spyOn(VeteranCardDocument, "fromRequestBody")
  .mockReturnValueOnce(veteranCardDocument);

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get Controller", () => {
    it("should render the form for inputting the Veteran Card document details when the user is not authenticated (no id_token in cookies)", async () => {
      const req = getMockReq({ cookies: {} });
      const { res } = getMockRes();

      await veteranCardDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith(
        "veteran-card-document-details-form.njk",
        {
          authenticated: false,
        },
      );
    });

    it("should render the form for inputting the Veteran Card document details when the user is authenticated", async () => {
      const req = getMockReq({ cookies: { id_token: "id_token" } });
      const { res } = getMockRes();

      await veteranCardDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith(
        "veteran-card-document-details-form.njk",
        {
          authenticated: true,
        },
      );
    });
  });

  describe("Post Controller", () => {
    const mockPhotoBuffer = Buffer.from("mock photo data");

    it("should render the error page when an error happens trying to process the request", async () => {
      const req = getMockReq({
        body: requestBody,
      });
      const { res } = getMockRes();
      saveDocument.mockRejectedValueOnce(new Error("SOME_DATABASE_ERROR"));

      await veteranCardDocumentBuilderPostController(req, res);

      expect(res.render).toHaveBeenCalledWith("500.njk");
    });

    it.each([
      ["JPEG", "420x525.jpg", "image/jpeg"],
      ["PNG", "100x125.png", "image/png"],
      ["JFIF", "photo.jfif", "image/jpeg"],
    ])('should upload a %s file', async (fileType, fileName, mimeType) => {
      const req = getMockReq({
        body: requestBody,
      });
      const { res } = getMockRes();
      req.body.photo = fileName;

      const mockReadFileSync = readFileSync as jest.Mock;
      mockReadFileSync.mockReturnValue(mockPhotoBuffer);

      await veteranCardDocumentBuilderPostController(req, res);

      const expectedPath = path.resolve(
        __dirname,
        "../../src/resources",
        fileName,
      )
      expect(mockReadFileSync).toHaveBeenCalledWith(expectedPath);
      expect(uploadPhoto).toHaveBeenCalledWith(
        mockPhotoBuffer,
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        "photosBucket",
        mimeType,
      );
    });

    it("should redirect to the credential offer page with 'digitalVeteranCard' in the query params when the document and photo are stored successfully", async () => {
      const req = getMockReq({
        body: requestBody,
        cookies: { dataModel: "v2.0" },
      });
      const { res } = getMockRes();
      req.body.photo = "420x525.jpg";

      const mockReadFileSync = readFileSync as jest.Mock;
      mockReadFileSync.mockReturnValue(mockPhotoBuffer);

      await veteranCardDocumentBuilderPostController(req, res);

      expect(VeteranCardDocument.fromRequestBody).toHaveBeenCalledWith(
        requestBody,
        "digitalVeteranCard",
        "s3://photosBucket/2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      );
      expect(uploadPhoto).toHaveBeenCalledWith(
        expect.any(Buffer),
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        "photosBucket",
        "image/jpeg",
      );
      expect(saveDocument).toHaveBeenNthCalledWith(1, "testTable", {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        vc: JSON.stringify(veteranCardDocument),
      });
      expect(saveDocument).toHaveBeenNthCalledWith(2, "testTable2", {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        data: {
          givenName: "Sarah Elizabeth",
          familyName: "Edwards-Smith",
          "dateOfBirth-day": "06",
          "dateOfBirth-month": "03",
          "dateOfBirth-year": "1975",
          "cardExpiryDate-day": "08",
          "cardExpiryDate-month": "04",
          "cardExpiryDate-year": "2029",
          serviceNumber: "25057386",
          serviceBranch: "HM Naval Service",
          photo: "s3://photosBucket/2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        },
        vcDataModel: "v2.0",
        vcType: "digitalVeteranCard",
      });

      expect(res.redirect).toHaveBeenCalledWith(
        "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=digitalVeteranCard&error=",
      );
    });

    it("should redirect to the credential offer page with 'digitalVeteranCard' and 'ERROR:401' in the query params when an error scenario has been selected", async () => {
      const requestBodyWithError = { ...requestBody };
      requestBodyWithError.throwError = "ERROR:401";
      const req = getMockReq({
        body: requestBodyWithError,
      });
      const { res } = getMockRes();
      req.body.photo = "420x525.jpg";

      const mockReadFileSync = readFileSync as jest.Mock;
      mockReadFileSync.mockReturnValue(mockPhotoBuffer);

      await veteranCardDocumentBuilderPostController(req, res);

      expect(VeteranCardDocument.fromRequestBody).toHaveBeenCalledWith(
        requestBodyWithError,
        "digitalVeteranCard",
        "s3://photosBucket/2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      );
      expect(uploadPhoto).toHaveBeenCalledWith(
        expect.any(Buffer),
        "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        "photosBucket",
        "image/jpeg",
      );
      expect(saveDocument).toHaveBeenCalledWith("testTable", {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
        vc: JSON.stringify(veteranCardDocument),
      });
      expect(res.redirect).toHaveBeenCalledWith(
        "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=digitalVeteranCard&error=ERROR:401",
      );
    });
  });
});
