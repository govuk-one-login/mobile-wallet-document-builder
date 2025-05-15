import {
  mdlDocumentBuilderGetController,
  mdlDocumentBuilderPostController,
} from "../../src/mdlDocumentBuilder/controller";
import { readFileSync } from "fs";
import * as databaseService from "../../src/services/databaseService";
import * as s3Service from "../../src/services/s3Service";
import { getMockReq, getMockRes } from "@jest-mock/express";
import * as path from "path";
import { buildMdlRequestBody } from "../utils/mdlRequestBodyBuilder";
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
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-05-02T00:00:00Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("get", () => {
    it("should render the form for inputting the mDL document details when the user is not authenticated (no id_token in cookies)", async () => {
      const req = getMockReq({ cookies: {} });
      const { res } = getMockRes();

      await mdlDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith("mdl-document-details-form.njk", {
        authenticated: false,
        defaultIssueDate: {
          day: "02",
          month: "05",
          year: "2025",
        },
        defaultExpiryDate: {
          day: "01",
          month: "05",
          year: "2035",
        },
      });
    });

    it("should render the form for inputting the mDL document details when the user is authenticated", async () => {
      const req = getMockReq({ cookies: { id_token: "id_token" } });
      const { res } = getMockRes();

      await mdlDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith("mdl-document-details-form.njk", {
        authenticated: true,
        defaultIssueDate: {
          day: "02",
          month: "05",
          year: "2025",
        },
        defaultExpiryDate: {
          day: "01",
          month: "05",
          year: "2035",
        },
      });
    });

    it("should render the 500 error page if an error is thrown", async () => {
      const req = getMockReq({ cookies: { id_token: "id_token" } });
      const { res } = getMockRes();

      (res.render as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Rendering error");
      });

      await mdlDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith("500.njk");
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
      issuing_country: "GB",
      document_number: "HALL9655293DH5RO",
      resident_address: "Flat 11, Blashford, Adelaide Road",
      resident_postal_code: "NW3 3RX",
      resident_city: "London",
      vehicleCategoryCode: ["A", "B"],
      "fullPrivilegeIssue-day": ["01", "01"],
      "fullPrivilegeIssue-month": ["05", "05"],
      "fullPrivilegeIssue-year": ["2025", "2025"],
      "fullPrivilegeExpiry-day": ["", "10"],
      "fullPrivilegeExpiry-month": ["", "08"],
      "fullPrivilegeExpiry-year": ["", "2030"],
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
      it(`should call the function to save the document with the correct arguments`, async () => {
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
            birth_date: "06-03-1975",
            birth_place: "London",
            issue_date: "08-04-2019",
            expiry_date: "08-04-2029",
            issuing_authority: "DVLA",
            issuing_country: "GB",
            document_number: "HALL9655293DH5RO",
            resident_address: "Flat 11, Blashford, Adelaide Road",
            resident_postal_code: "NW3 3RX",
            resident_city: "London",
            un_distinguishing_sign: "UK",
            full_driving_privileges: [
              {
                vehicle_category_code: "A",
                issue_date: "01-05-2025",
                expiry_date: null,
              },
              {
                vehicle_category_code: "B",
                issue_date: "01-05-2025",
                expiry_date: "10-08-2030",
              },
            ],
          },
          vcType: "mobileDrivingLicence",
        });
      });
    });

    describe("given the document and photo have been stored successfully", () => {
      describe("when an error scenario has not been selected", () => {
        it("should redirect to the credential offer page with only 'mobileDrivingLicence' in the query params", async () => {
          const req = getMockReq({
            body: requestBody,
          });
          const { res } = getMockRes();

          await mdlDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=mobileDrivingLicence&error=",
          );
        });
      });

      describe("when the error scenario 'ERROR:401' is selected", () => {
        it("should redirect to the credential offer page with 'mobileDrivingLicence' and 'ERROR:401' in the query params", async () => {
          const req = getMockReq({
            body: {
              ...requestBody,
              ...{ throwError: "ERROR:401" },
            },
          });
          const { res } = getMockRes();

          await mdlDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=mobileDrivingLicence&error=ERROR:401",
          );
        });
      });
    });

    describe("Date validation", () => {
      it("should render an error when the birthdate has empty fields", async () => {
        const body = buildMdlRequestBody({
          "birth-day": "",
          "birth-month": "08",
          "birth-year": "",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await mdlDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "mdl-document-details-form.njk",
          {
            errors: expect.objectContaining({
              birth_date: "Enter a valid birth date",
            }),
            authenticated: true,
            defaultIssueDate: {
              day: "02",
              month: "05",
              year: "2025",
            },
            defaultExpiryDate: {
              day: "01",
              month: "05",
              year: "2035",
            },
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the birth-day is 29 for february but the year is not a leap year", async () => {
        const body = buildMdlRequestBody({
          "birth-day": "29",
          "birth-month": "02",
          "birth-year": "2019",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await mdlDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "mdl-document-details-form.njk",
          {
            errors: expect.objectContaining({
              birth_date: "Enter a valid birth date",
            }),
            authenticated: true,
            defaultIssueDate: {
              day: "02",
              month: "05",
              year: "2025",
            },
            defaultExpiryDate: {
              day: "01",
              month: "05",
              year: "2035",
            },
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the birth date is in the future", async () => {
        const body = buildMdlRequestBody({
          "birth-day": "10",
          "birth-month": "08",
          "birth-year": "2026",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await mdlDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "mdl-document-details-form.njk",
          {
            errors: expect.objectContaining({
              birth_date: "Enter a valid birth date",
            }),
            authenticated: true,
            defaultIssueDate: {
              day: "02",
              month: "05",
              year: "2025",
            },
            defaultExpiryDate: {
              day: "01",
              month: "05",
              year: "2035",
            },
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the issue date is empty", async () => {
        const body = buildMdlRequestBody({
          "issue-day": "04",
          "issue-month": "",
          "issue-year": "",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await mdlDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "mdl-document-details-form.njk",
          {
            errors: expect.objectContaining({
              issue_date: "Enter a valid issue date",
            }),
            authenticated: true,
            defaultIssueDate: {
              day: "02",
              month: "05",
              year: "2025",
            },
            defaultExpiryDate: {
              day: "01",
              month: "05",
              year: "2035",
            },
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the issue day is 31 and issue month is June", async () => {
        const body = buildMdlRequestBody({
          "issue-day": "31",
          "issue-month": "06",
          "issue-year": "2020",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await mdlDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "mdl-document-details-form.njk",
          {
            errors: expect.objectContaining({
              issue_date: "Enter a valid issue date",
            }),
            authenticated: true,
            defaultIssueDate: {
              day: "02",
              month: "05",
              year: "2025",
            },
            defaultExpiryDate: {
              day: "01",
              month: "05",
              year: "2035",
            },
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the issue date is in the future", async () => {
        const body = buildMdlRequestBody({
          "issue-day": "02",
          "issue-month": "08",
          "issue-year": "2030",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await mdlDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "mdl-document-details-form.njk",
          {
            errors: expect.objectContaining({
              issue_date: "Enter a valid issue date",
            }),
            authenticated: true,
            defaultIssueDate: {
              day: "02",
              month: "05",
              year: "2025",
            },
            defaultExpiryDate: {
              day: "01",
              month: "05",
              year: "2035",
            },
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the expiry date is empty", async () => {
        const body = buildMdlRequestBody({
          "expiry-day": "05",
          "expiry-month": "",
          "expiry-year": "",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await mdlDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "mdl-document-details-form.njk",
          {
            errors: expect.objectContaining({
              expiry_date: "Enter a valid expiry date",
            }),
            authenticated: true,
            defaultIssueDate: {
              day: "02",
              month: "05",
              year: "2025",
            },
            defaultExpiryDate: {
              day: "01",
              month: "05",
              year: "2035",
            },
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the expiry date is in the past", async () => {
        const body = buildMdlRequestBody({
          "expiry-day": "03",
          "expiry-month": "08",
          "expiry-year": "2019",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await mdlDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "mdl-document-details-form.njk",
          {
            errors: expect.objectContaining({
              expiry_date: "Enter a valid expiry date",
            }),
            authenticated: true,
            defaultIssueDate: {
              day: "02",
              month: "05",
              year: "2025",
            },
            defaultExpiryDate: {
              day: "01",
              month: "05",
              year: "2035",
            },
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the expiry date is invalid", async () => {
        const body = buildMdlRequestBody({
          "expiry-day": "45",
          "expiry-month": "14",
          "expiry-year": "pp!",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await mdlDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "mdl-document-details-form.njk",
          {
            errors: expect.objectContaining({
              expiry_date: "Enter a valid expiry date",
            }),
            authenticated: true,
            defaultIssueDate: {
              day: "02",
              month: "05",
              year: "2025",
            },
            defaultExpiryDate: {
              day: "01",
              month: "05",
              year: "2035",
            },
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });
    });
  });
});
