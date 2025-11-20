import {
  fishingLicenceDocumentBuilderGetController,
  fishingLicenceDocumentBuilderPostController,
} from "../../src/fishingLicenceDocumentBuilder/controller";
import { readFileSync } from "fs";
import * as databaseService from "../../src/services/databaseService";
import * as s3Service from "../../src/services/s3Service";
import { getMockReq, getMockRes } from "@jest-mock/express";
import * as path from "path";
import { FishingLicenceRequestBody } from "../../src/fishingLicenceDocumentBuilder/types/FishingLicenceRequestBody";
import { ERROR_CHOICES } from "../../src/utils/errorChoices";
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
    beforeEach(() => {
      jest.spyOn(Math, "random").mockReturnValue(0.5);
    });

    afterEach(() => {
      jest.spyOn(Math, "random").mockRestore();
    });

    it("should render the form for inputting the fishing licence document details when the user is not authenticated (no id_token in cookies)", async () => {
      const req = getMockReq({ cookies: {} });
      const { res } = getMockRes();

      await fishingLicenceDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith(
        "fishing-licence-document-details-form.njk",
        {
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
          errorChoices: ERROR_CHOICES,
          fishingLicenceNumber: "EDWAR550000SE5RO",
        },
      );
    });

    it("should render the form for inputting the fishing licence document details when the user is authenticated", async () => {
      const req = getMockReq({ cookies: { id_token: "id_token" } });
      const { res } = getMockRes();

      await fishingLicenceDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith(
        "fishing-licence-document-details-form.njk",
        {
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
          errorChoices: ERROR_CHOICES,
          fishingLicenceNumber: "EDWAR550000SE5RO",
        },
      );
    });

    it("should render the 500 error page if an error is thrown", async () => {
      const req = getMockReq({ cookies: { id_token: "id_token" } });
      const { res } = getMockRes();

      (res.render as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Rendering error");
      });

      await fishingLicenceDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith("500.njk");
    });
  });

  describe("post", () => {
    const requestBody = buildFishingLicenceRequestBody();

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

        await fishingLicenceDocumentBuilderPostController(req, res);

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

          await fishingLicenceDocumentBuilderPostController(req, res);

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
      it("should call the function to save the document with the correct arguments", async () => {
        const req = getMockReq({
          body: requestBody,
        });
        const { res } = getMockRes();

        await fishingLicenceDocumentBuilderPostController(req, res);

        expect(saveDocument).toHaveBeenCalledWith("testTable", {
          itemId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          documentId: "EDWAR550000SE5RO",
          vcType: "uk.gov.account.mobile.example-cri.fishinglicence.1",
          timeToLive: 1748736000,
          data: {
            family_name: "Smith",
            given_name: "John",
            portrait: "s3://photosBucket/2e0fac05-4b38-480f-9cbd-b046eabe1e46",
            birth_date: "15-06-1985",
            issue_date: "01-04-2024",
            expiry_date: "01-04-2029",
            issuing_country: "GB",
            document_number: "EDWAR550000SE5RO",
            type_of_fish: "Trout",
            number_of_fishing_rods: "2",
            credentialTtlMinutes: 43200,
          },
        });
      });
    });

    describe("given the document and photo have been stored successfully", () => {
      describe("when an unknown error code has been received in the request body", () => {
        it("should redirect to the credential offer page with only the fishing licence type in the query params", async () => {
          const req = getMockReq({
            body: requestBody,
          });
          const { res } = getMockRes();

          await fishingLicenceDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=uk.gov.account.mobile.example-cri.fishinglicence.1",
          );
        });
      });

      describe("when an error scenario has not been selected", () => {
        it("should redirect to the credential offer page with only the fishing licence type in the query params", async () => {
          const req = getMockReq({
            body: requestBody,
          });
          const { res } = getMockRes();

          await fishingLicenceDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=uk.gov.account.mobile.example-cri.fishinglicence.1",
          );
        });
      });

      describe("when an error scenario has been selected", () => {
        it.each(["ERROR:GRANT", "ERROR:500", "ERROR:401", "ERROR:CLIENT"])(
          "should redirect with the correct error parameter when selectedError is '%s'",
          async (selectedError) => {
            const req = getMockReq({
              body: { ...requestBody, ...{ throwError: selectedError } },
            });
            const { res } = getMockRes();
            await fishingLicenceDocumentBuilderPostController(req, res);

            expect(res.redirect).toHaveBeenCalledWith(
              `/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=uk.gov.account.mobile.example-cri.fishinglicence.1&error=${selectedError}`,
            );
          },
        );
      });
    });

    describe("date validation errors", () => {
      it("should render an error when the birthdate has empty fields", async () => {
        const body = buildFishingLicenceRequestBody({
          "birth-day": "",
          "birth-month": "08",
          "birth-year": "",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await fishingLicenceDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "fishing-licence-document-details-form.njk",
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
            errorChoices: ERROR_CHOICES,
            fishingLicenceNumber: "EDWAR550000SE5RO",
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the birth-day is 29 for february but the year is not a leap year", async () => {
        const body = buildFishingLicenceRequestBody({
          "birth-day": "29",
          "birth-month": "02",
          "birth-year": "2019",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await fishingLicenceDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "fishing-licence-document-details-form.njk",
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
            errorChoices: ERROR_CHOICES,
            fishingLicenceNumber: "EDWAR550000SE5RO",
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the issue date is empty", async () => {
        const body = buildFishingLicenceRequestBody({
          "issue-day": "04",
          "issue-month": "",
          "issue-year": "",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await fishingLicenceDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "fishing-licence-document-details-form.njk",
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
            errorChoices: ERROR_CHOICES,
            fishingLicenceNumber: "EDWAR550000SE5RO",
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the issue day is 31 and issue month is June", async () => {
        const body = buildFishingLicenceRequestBody({
          "issue-day": "31",
          "issue-month": "06",
          "issue-year": "2020",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await fishingLicenceDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "fishing-licence-document-details-form.njk",
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
            errorChoices: ERROR_CHOICES,
            fishingLicenceNumber: "EDWAR550000SE5RO",
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the expiry date is empty", async () => {
        const body = buildFishingLicenceRequestBody({
          "expiry-day": "05",
          "expiry-month": "",
          "expiry-year": "",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await fishingLicenceDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "fishing-licence-document-details-form.njk",
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
            errorChoices: ERROR_CHOICES,
            fishingLicenceNumber: "EDWAR550000SE5RO",
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it("should render an error when the expiry date is invalid", async () => {
        const body = buildFishingLicenceRequestBody({
          "expiry-day": "45",
          "expiry-month": "14",
          "expiry-year": "pp!",
        });
        const req = getMockReq({
          body,
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();
        await fishingLicenceDocumentBuilderPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(
          "fishing-licence-document-details-form.njk",
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
            errorChoices: ERROR_CHOICES,
            fishingLicenceNumber: "EDWAR550000SE5RO",
          },
        );
        expect(res.redirect).not.toHaveBeenCalled();
      });
    });
  });
});

export function buildFishingLicenceRequestBody(
  overrides: Partial<FishingLicenceRequestBody> = {},
): FishingLicenceRequestBody {
  const defaults: FishingLicenceRequestBody = {
    family_name: "Smith",
    given_name: "John",
    portrait: "420x525.jpg",
    "birth-day": "15",
    "birth-month": "06",
    "birth-year": "1985",
    "issue-day": "01",
    "issue-month": "04",
    "issue-year": "2024",
    "expiry-day": "01",
    "expiry-month": "04",
    "expiry-year": "2029",
    issuing_country: "GB",
    document_number: "EDWAR550000SE5RO",
    type_of_fish: "Trout",
    fishing_rods: "2",
    credentialTtl: "43200",
    throwError: "",
  };
  return { ...defaults, ...overrides };
}
