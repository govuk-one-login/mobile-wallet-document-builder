import {
  dbsDocumentBuilderGetController,
  dbsDocumentBuilderPostController,
} from "../../src/dbsDocumentBuilder/controller";
import { DbsDocument } from "../../src/dbsDocumentBuilder/models/dbsDocument";
import * as databaseService from "../../src/services/databaseService";
import { getMockReq, getMockRes } from "@jest-mock/express";
process.env.DOCUMENTS_TABLE_NAME = "testTable";
process.env.DOCUMENTS_V2_TABLE_NAME = "testTable2";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("2e0fac05-4b38-480f-9cbd-b046eabe1e46"),
}));
jest.mock("../../src/dbsDocumentBuilder/models/dbsDocument");
jest.mock("../../src/services/databaseService", () => ({
  saveDocument: jest.fn(),
}));

describe("controller.ts", () => {
  describe("get", () => {
    it("should render the form for inputting DBS document details when user is not authenticated (no id_token in cookies)", async () => {
      const req = getMockReq({ cookies: {} });
      const { res } = getMockRes();

      await dbsDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith("dbs-document-details-form.njk", {
        authenticated: false,
      });
    });

    it("should render the form for inputting DBS document details when user is authenticated", async () => {
      const req = getMockReq({ cookies: { id_token: "id_token" } });
      const { res } = getMockRes();

      await dbsDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith("dbs-document-details-form.njk", {
        authenticated: true,
      });
    });
  });

  describe("post", () => {
    const requestBody = {
      "issuance-day": "16",
      "issuance-month": "1",
      "issuance-year": "2025",
      "expiration-day": "16",
      "expiration-month": "1",
      "expiration-year": " 2026",
      firstName: "Sarah Elizabeth",
      lastName: "Edwards",
      "birth-day": "6",
      "birth-month": "3",
      "birth-year": "1980",
      subBuildingName: "Flat 11",
      buildingName: "",
      streetName: "Adelaide Road",
      addressLocality: "London",
      addressCountry: "GB",
      postalCode: "NW3 3RX",
      certificateNumber: "009878863",
      applicationNumber: "E0023455534",
      throwError: "",
    };

    const dbsDocument = {
      type: ["VerifiableCredential", "BasicCheckCredential"],
      credentialSubject: {
        issuanceDate: "2025-1-16",
        expirationDate: "2026-1-16",
        name: [
          {
            nameParts: [
              { type: "GivenName", value: "Sarah" },
              {
                type: "GivenName",
                value: "Elizabeth",
              },
              { type: "FamilyName", value: "Edwards" },
            ],
          },
        ],
        birthDate: [{ value: "2024-1-16" }],
        address: [
          {
            addressCountry: "GB",
            addressLocality: "London",
            buildingName: "",
            postalCode: "NW3 3RX",
            streetName: "Adelaide Road",
            subBuildingName: "Flat 11",
          },
        ],
        basicCheckRecord: [
          {
            applicationNumber: "E0023455534",
            certificateNumber: "009878863",
            certificateType: "basic",
            outcome: "Result clear",
            policeRecordsCheck: "Clear",
          },
        ],
      },
    };
    jest.spyOn(DbsDocument, "fromRequestBody").mockReturnValue(dbsDocument);

    const saveDocument = databaseService.saveDocument as jest.Mock;

    describe("given an error happens trying to process the request", () => {
      it("should render the error page", async () => {
        saveDocument.mockRejectedValueOnce(new Error("SOME_DATABASE_ERROR"));
        const req = getMockReq({
          body: requestBody,
          cookies: { dataModel: "v2.0" },
        });
        const { res } = getMockRes();

        await dbsDocumentBuilderPostController(req, res);

        expect(res.render).toHaveBeenCalledWith("500.njk");
      });
    });

    describe("given the document has been created", () => {
      it(`should call the function to save the document twice and with the correct arguments`, async () => {
        const req = getMockReq({
          body: requestBody,
          cookies: { dataModel: "v2.0" },
        });
        const { res } = getMockRes();

        await dbsDocumentBuilderPostController(req, res);

        expect(saveDocument).toHaveBeenNthCalledWith(1, "testTable", {
          documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          vc: JSON.stringify({
            type: ["VerifiableCredential", "BasicCheckCredential"],
            credentialSubject: {
              issuanceDate: "2025-1-16",
              expirationDate: "2026-1-16",
              name: [
                {
                  nameParts: [
                    { type: "GivenName", value: "Sarah" },
                    {
                      type: "GivenName",
                      value: "Elizabeth",
                    },
                    { type: "FamilyName", value: "Edwards" },
                  ],
                },
              ],
              birthDate: [{ value: "2024-1-16" }],
              address: [
                {
                  addressCountry: "GB",
                  addressLocality: "London",
                  buildingName: "",
                  postalCode: "NW3 3RX",
                  streetName: "Adelaide Road",
                  subBuildingName: "Flat 11",
                },
              ],
              basicCheckRecord: [
                {
                  applicationNumber: "E0023455534",
                  certificateNumber: "009878863",
                  certificateType: "basic",
                  outcome: "Result clear",
                  policeRecordsCheck: "Clear",
                },
              ],
            },
          }),
        });
        expect(saveDocument).toHaveBeenNthCalledWith(2, "testTable2", {
          documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          data: {
            "issuance-day": "16",
            "issuance-month": "1",
            "issuance-year": "2025",
            "expiration-day": "16",
            "expiration-month": "1",
            "expiration-year": " 2026",
            "birth-day": "6",
            "birth-month": "3",
            "birth-year": "1980",
            firstName: "Sarah Elizabeth",
            lastName: "Edwards",
            subBuildingName: "Flat 11",
            buildingName: "",
            streetName: "Adelaide Road",
            addressLocality: "London",
            addressCountry: "GB",
            postalCode: "NW3 3RX",
            certificateNumber: "009878863",
            applicationNumber: "E0023455534",
            certificateType: "basic",
            outcome: "Result clear",
            policeRecordsCheck: "Clear",
          },
          vcDataModel: "v2.0",
          vcType: "BasicCheckCredential",
        });
      });
    });

    describe("given the document has been saved successfully", () => {
      describe("when an error scenario has not been selected", () => {
        it("should redirect to the credential offer page with only 'BasicCheckCredential' in the query params", async () => {
          const req = getMockReq({
            body: requestBody,
            cookies: { dataModel: "v2.0" },
          });
          const { res } = getMockRes();

          await dbsDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=BasicCheckCredential&error=",
          );
        });
      });

      describe("when the error scenario 'ERROR:500' has been selected", () => {
        it("should redirect to the credential offer page with 'BasicCheckCredential' and 'ERROR:500' in the query params", async () => {
          const req = getMockReq({
            body: {
              ...requestBody,
              ...{ throwError: "ERROR:500" },
            },
            cookies: { dataModel: "v2.0" },
          });
          const { res } = getMockRes();

          await dbsDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=BasicCheckCredential&error=ERROR:500",
          );
        });
      });
    });
  });
});
