import {
  veteranCardDocumentBuilderGetController,
  veteranCardDocumentBuilderPostController,
} from "../../src/veteranCardDocumentBuilder/controller";
import { VeteranCardDocument } from "../../src/veteranCardDocumentBuilder/models/veteranCardDocument";
import * as databaseService from "../../src/services/databaseService";
import { getMockReq, getMockRes } from "@jest-mock/express";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("2e0fac05-4b38-480f-9cbd-b046eabe1e46"),
}));
jest.mock("../../src/services/databaseService", () => ({
  saveDocument: jest.fn(),
}));

const saveDocument = databaseService.saveDocument as jest.Mock;

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
    throwError: "ERROR:401",
  };

  const veteranCardDocument = {
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

  it("should render the form for inputting Veteran Card document details when user is not authenticated (no id_token in cookies)", async () => {
    const req = getMockReq({ cookies: {} });
    const { res } = getMockRes();

    await veteranCardDocumentBuilderGetController(req, res);

    expect(res.render).toHaveBeenCalledWith(
      "veteran-card-document-details-form.njk",
      {
        authenticated: false,
      }
    );
  });

  it("should render the form for inputting Veteran Card document details when user is authenticated", async () => {
    const req = getMockReq({ cookies: { id_token: "id_token" } });
    const { res } = getMockRes();

    await veteranCardDocumentBuilderGetController(req, res);

    expect(res.render).toHaveBeenCalledWith(
      "veteran-card-document-details-form.njk",
      {
        authenticated: true,
      }
    );
  });

  it("should redirect to the credential offer page with 'digitalVeteranCard' and 'ERROR:401' in the query params", async () => {
    const req = getMockReq({
      body: requestBody,
    });
    const { res } = getMockRes();
    jest
      .spyOn(VeteranCardDocument, "fromRequestBody")
      .mockReturnValueOnce(veteranCardDocument);

    await veteranCardDocumentBuilderPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=digitalVeteranCard&error=ERROR:401"
    );
    expect(VeteranCardDocument.fromRequestBody).toHaveBeenCalledWith(
      requestBody,
      "digitalVeteranCard"
    );
    expect(saveDocument).toHaveBeenCalledWith(
      veteranCardDocument,
      "2e0fac05-4b38-480f-9cbd-b046eabe1e46"
    );
  });

  it("should render an error page when an error happens", async () => {
    const req = getMockReq({
      body: requestBody,
    });
    const { res } = getMockRes();
    jest
      .spyOn(VeteranCardDocument, "fromRequestBody")
      .mockReturnValueOnce(veteranCardDocument);
    saveDocument.mockRejectedValueOnce(new Error("SOME_DATABASE_ERROR"));

    await veteranCardDocumentBuilderPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("500.njk");
  });
});
