import {
  mdlDocumentBuilderGetController,
  mdlDocumentBuilderPostController,
} from "../../src/mdlDocumentBuilder/controller";
import { readFileSync } from "fs";
import * as databaseService from "../../src/services/databaseService";
import * as s3Service from "../../src/services/s3Service";
import { getMockReq, getMockRes } from "@jest-mock/express";
import * as path from "path";
process.env.PHOTOS_BUCKET_NAME = "photosBucket";
process.env.ENVIRONMENT = "local";
process.env.DOCUMENTS_TABLE_NAME = "testTable";

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

describe("controller.ts", () => {
  describe("get", () => {
    it("should render the form for inputting the mDL document details when the user is not authenticated (no id_token in cookies)", async () => {
      const req = getMockReq({ cookies: {} });
      const { res } = getMockRes();

      await mdlDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith("mdl-document-details-form.njk", {
        authenticated: false,
      });
    });

    it("should render the form for inputting the mDL document details when the user is authenticated", async () => {
      const req = getMockReq({ cookies: { id_token: "id_token" } });
      const { res } = getMockRes();

      await mdlDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith("mdl-document-details-form.njk", {
        authenticated: true,
      });
    });
  });

  describe("post", () => {
    const requestBody = {
      family_name: "Edwards-Smith",
      given_name: "Sarah Elizabeth",
      portrait: "420x525.jpg",
      "birth-day": "06",
      "birth-month": "03",
      "birth-year": "1975",
      birth_place: "London",
      "issue-day": "08",
      "issue-month": "04",
      "issue-year": "2019",
      "expiry-day": "08",
      "expiry-month": "04",
      "expiry-year": "2029",
      issuing_authority: "DVLA",
      issuing_country: "United Kingdom (UK)",
      document_number: "25057386",
      resident_address: "Flat 11, Blashford, Adelaide Road",
      resident_postal_code: "NW3 3RX",
      resident_city: "London",
      throwError: "",
    };

    const photoBuffer = Buffer.from("mock photo data");
    const mockReadFileSync = readFileSync as jest.Mock;
    mockReadFileSync.mockReturnValue(Buffer.from("mock photo data"));

    const saveDocument = databaseService.saveDocument as jest.Mock;
    const uploadPhoto = s3Service.uploadPhoto as jest.Mock;

    describe("given an error happens trying to process the request", () => {
      it("should render the error page", async () => {
        saveDocument.mockRejectedValueOnce(new Error("SOME_DATABASE_ERROR"));
        const req = getMockReq({
          body: requestBody,
        });
        const { res } = getMockRes();

        await mdlDocumentBuilderPostController(req, res);

        expect(res.render).toHaveBeenCalledWith("500.njk");
      });
    });

    describe.each([
      ["JPEG", "420x525.jpg", "image/jpeg"],
      ["PNG", "100x125.png", "image/png"],
      ["JFIF", "photo.jfif", "image/jpeg"],
    ])(
      "given a file of type %s is to be uploaded",
      (fileType, fileName, mimeType) => {
        it(`should call the upload function with the correct arguments`, async () => {
          const req = getMockReq({
            body: {
              ...requestBody,
              ...{ portrait: fileName },
            },
          });
          const { res } = getMockRes();

          await mdlDocumentBuilderPostController(req, res);

          const expectedPath = path.resolve(
            __dirname,
            "../../src/resources",
            fileName,
          );
          expect(mockReadFileSync).toHaveBeenCalledWith(expectedPath);
          expect(uploadPhoto).toHaveBeenCalledWith(
            photoBuffer,
            "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
            "photosBucket",
            mimeType,
          );
        });
      },
    );

    describe("given the photo has been stored successfully", () => {
      it(`should call the function to save the document twice and with the correct arguments`, async () => {
        const req = getMockReq({
          body: requestBody,
        });
        const { res } = getMockRes();

        await mdlDocumentBuilderPostController(req, res);

        expect(saveDocument).toHaveBeenCalledWith("testTable", {
          documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          data: {
            family_name: "Edwards-Smith",
            given_name: "Sarah Elizabeth",
            portrait: "s3://photosBucket/2e0fac05-4b38-480f-9cbd-b046eabe1e46",
            "birth-day": "06",
            "birth-month": "03",
            "birth-year": "1975",
            birth_place: "London",
            "issue-day": "08",
            "issue-month": "04",
            "issue-year": "2019",
            "expiry-day": "08",
            "expiry-month": "04",
            "expiry-year": "2029",
            issuing_authority: "DVLA",
            issuing_country: "United Kingdom (UK)",
            document_number: "25057386",
            resident_address: "Flat 11, Blashford, Adelaide Road",
            resident_postal_code: "NW3 3RX",
            resident_city: "London",
          },
          vcType: "mobileDrivingLicense",
        });
      });
    });

    describe("given the document and photo have been stored successfully", () => {
      describe("when an error scenario has not been selected", () => {
        it("should redirect to the credential offer page with only 'mobileDrivingLicense' in the query params", async () => {
          const req = getMockReq({
            body: requestBody,
          });
          const { res } = getMockRes();

          await mdlDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=mobileDrivingLicense&error=",
          );
        });
      });
      describe("when the error scenario 'ERROR:401' is selected", () => {
        it("should redirect to the credential offer page with 'mobileDrivingLicense' and 'ERROR:401' in the query params", async () => {
          const req = getMockReq({
            body: {
              ...requestBody,
              ...{ throwError: "ERROR:401" },
            },
          });
          const { res } = getMockRes();

          await mdlDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=mobileDrivingLicense&error=ERROR:401",
          );
        });
      });
    });
  });
});
