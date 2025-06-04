import { readFileSync } from "fs";
import {
  veteranCardDocumentBuilderGetController,
  veteranCardDocumentBuilderPostController,
} from "../../src/veteranCardDocumentBuilder/controller";
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

  describe("post", () => {
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
      photo: "420x525.jpg",
      credentialTtl: "525600",
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

        await veteranCardDocumentBuilderPostController(req, res);

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
              ...{ photo: fileName },
            },
          });
          const { res } = getMockRes();

          await veteranCardDocumentBuilderPostController(req, res);

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
      it(`should call the function to save the document with the correct arguments`, async () => {
        const req = getMockReq({
          body: requestBody,
        });
        const { res } = getMockRes();

        await veteranCardDocumentBuilderPostController(req, res);

        expect(saveDocument).toHaveBeenCalledWith("testTable", {
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
            credentialTtlMinutes: 525600,
            photo: "s3://photosBucket/2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          },
          vcType: "digitalVeteranCard",
        });
      });
    });

    describe("given the document and photo have been stored successfully", () => {
      describe("when an error scenario has not been selected", () => {
        it("should redirect to the credential offer page with only 'digitalVeteranCard' in the query params", async () => {
          const req = getMockReq({
            body: requestBody,
          });
          const { res } = getMockRes();

          await veteranCardDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=digitalVeteranCard&error=",
          );
        });
      });

      describe("when the error scenario 'ERROR:401' has been selected", () => {
        it("should redirect to the credential offer page with 'digitalVeteranCard' and 'ERROR:401' in the query params", async () => {
          const req = getMockReq({
            body: {
              ...requestBody,
              ...{ throwError: "ERROR:401" },
            },
          });
          const { res } = getMockRes();

          await veteranCardDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=digitalVeteranCard&error=ERROR:401",
          );
        });
      });
      describe("when one of the error scenarios has been selected", () => {
        it.each(["ERROR:CLIENT", "ERROR:500", "ERROR:401", "ERROR:GRANT"])(
          "should redirect with the correct error parameter when selectedError is '%s'",
          async (selectedError) => {
            const req = getMockReq({
              body: { ...requestBody, ...{ throwError: selectedError } },
            });
            const { res } = getMockRes();
            await veteranCardDocumentBuilderPostController(req, res);

            const expectedRedirect =
              selectedError === "SOME_OTHER_ERROR"
                ? "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=digitalVeteranCard&error="
                : `/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=digitalVeteranCard&error=${selectedError}`;

            expect(res.redirect).toHaveBeenCalledWith(expectedRedirect);
          },
        );
      });
    });
  });
});
