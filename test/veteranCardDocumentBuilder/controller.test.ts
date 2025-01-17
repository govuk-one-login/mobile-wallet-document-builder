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
    givenName: "Sarah Elizabeth",
    familyName: "Edwards-Smith",
    "dateOfBirth-day": "06",
    "dateOfBirth-month": "03",
    "dateOfBirth-year": "1975",
    "cardExpiryDate-day": "08",
    "cardExpiryDate-month": "04",
    "cardExpiryDate-year": "2029",
    "serviceStartDate-day": "22",
    "serviceStartDate-month": "09",
    "serviceStartDate-year": "1996",
    "serviceEndDate-day": "30",
    "serviceEndDate-month": "11",
    "serviceEndDate-year": "2007",
    serviceNumber: "25057386",
    serviceBranch: "HM Naval Service",
    throwError: "ERROR:401",
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
          serviceStart: "1996-09-22",
          serviceEnd: "2007-11-30",
          serviceNumber: "25057386",
          serviceBranch: "HM Naval Service",
          photo: "",
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
