import {
  dbsDocumentBuilderGetController,
  dbsDocumentBuilderPostController,
} from "../../src/dbsDocumentBuilder/controller";
import { DbsDocument } from "../../src/dbsDocumentBuilder/models/dbsDocument";
import * as databaseService from "../../src/services/databaseService";
import { getMockReq, getMockRes } from "@jest-mock/express";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("2e0fac05-4b38-480f-9cbd-b046eabe1e46"),
}));
jest.mock("../../src/dbsDocumentBuilder/models/dbsDocument");
jest.mock("../../src/services/databaseService", () => ({
  saveDocument: jest.fn(),
}));

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const saveDocument = databaseService.saveDocument as jest.Mock;

  it("should render the form for inputting DBS document details", async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    await dbsDocumentBuilderGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("dbs-document-details-form.njk");
  });

  it("should redirect to the credential offer page with 'selected-app', 'BasicCheckCredential' and 'ERROR:500' in the query params", async () => {
    const requestBody = {
      "issuance-day": "16",
      "issuance-month": "1",
      "issuance-year": "2024",
      firstName: "Sarah Elizabeth",
      lastName: "Edwards",
      "birth-day": "6",
      "birth-month": "3",
      "birth-year": "1980",
      subBuildingName: "Flat 11",
      buildingName: "Blashford",
      streetName: "Adelaide Road",
      addressLocality: "London",
      addressCountry: "GB",
      postalCode: "NW3 3RX",
      certificateNumber: "009878863",
      applicationNumber: "E0023455534",
      throwError: "ERROR:500",
    };
    const req = getMockReq({
      body: requestBody,
    });
    const { res } = getMockRes();
    const dbsDocument = {
      type: ["VerifiableCredential", "BasicCheckCredential"],
      credentialSubject: {
        issuanceDate: "2024-1-16",
        expirationDate: "2025-3-6",
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
            buildingName: "Blashford",
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
    jest.spyOn(DbsDocument, "fromRequestBody").mockReturnValueOnce(dbsDocument);

    await dbsDocumentBuilderPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=BasicCheckCredential&error=ERROR:500"
    );
    expect(DbsDocument.fromRequestBody).toHaveBeenCalledWith(
      requestBody,
      "BasicCheckCredential"
    );
    expect(saveDocument).toHaveBeenCalledWith(
      dbsDocument,
      "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      "walletSubjectIdPlaceholder"
    );
  });

  it("should render an error page when an error happens", async () => {
    const requestBody = {
      "issuance-day": "16",
      "issuance-month": "1",
      "issuance-year": "2024",
      firstName: "Sarah Elizabeth",
      lastName: "Edwards",
      "birth-day": "6",
      "birth-month": "3",
      "birth-year": "1980",
      subBuildingName: "Flat 11",
      buildingName: "Blashford",
      streetName: "Adelaide Road",
      addressLocality: "London",
      addressCountry: "GB",
      postalCode: "NW3 3RX",
      certificateNumber: "009878863",
      applicationNumber: "E0023455534",
    };
    const req = getMockReq({
      body: requestBody,
    });
    const { res } = getMockRes();
    const dbsDocument = {
      type: ["VerifiableCredential", "BasicCheckCredential"],
      credentialSubject: {
        issuanceDate: "2024-1-16",
        expirationDate: "2025-3-6",
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
            buildingName: "Blashford",
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
    jest.spyOn(DbsDocument, "fromRequestBody").mockReturnValueOnce(dbsDocument);
    saveDocument.mockRejectedValueOnce(new Error("SOME_DATABASE_ERROR"));

    await dbsDocumentBuilderPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("500.njk");
  });
});
