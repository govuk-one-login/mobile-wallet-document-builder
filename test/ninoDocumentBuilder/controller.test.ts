import { NinoDocument } from "../../src/ninoDocumentBuilder/models/ninoDocument";
import * as databaseService from "../../src/services/databaseService";
import { getMockReq, getMockRes } from "@jest-mock/express";
import {
  ninoDocumentBuilderGetController,
  ninoDocumentBuilderPostController,
} from "../../src/ninoDocumentBuilder/controller";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("2e0fac05-4b38-480f-9cbd-b046eabe1e46"),
}));
jest.mock("../../src/ninoDocumentBuilder/models/ninoDocument");
jest.mock("../../src/services/databaseService", () => ({
  saveDocument: jest.fn(),
}));

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const saveDocument = databaseService.saveDocument as jest.Mock;

  it("should render the form for inputting NINO document details", async () => {
    const req = getMockReq({
      query: {
        app: "any-app",
      },
    });
    const { res } = getMockRes();

    await ninoDocumentBuilderGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("nino-document-details-form.njk", {
      selectedApp: "any-app",
    });
  });

  it("should redirect to the credential offer page with SocialSecurityCredential in the query params", async () => {
    const requestBody = {
      title: "Ms",
      givenName: "Irene",
      familyName: "Adler",
      nino: "QQ123456A",
    };
    const req = getMockReq({
      body: requestBody,
      query: {
        app: "any-app",
      },
    });
    const { res } = getMockRes();
    const ninoDocument = {
      credentialSubject: {
        name: [
          {
            nameParts: [
              { type: "Title", value: "Ms" },
              { type: "GivenName", value: "Irene" },
              { type: "FamilyName", value: "Adler" },
            ],
          },
        ],
        socialSecurityRecord: [{ personalNumber: "QQ123456A" }],
      },
      type: ["VerifiableCredential", "SocialSecurityCredential"],
    };
    jest
      .spyOn(NinoDocument, "fromRequestBody")
      .mockReturnValueOnce(ninoDocument);

    await ninoDocumentBuilderPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?app=any-app&type=SocialSecurityCredential"
    );
    expect(NinoDocument.fromRequestBody).toHaveBeenCalledWith(
      requestBody,
      "SocialSecurityCredential"
    );
    expect(saveDocument).toHaveBeenCalledWith(
      ninoDocument,
      "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      "walletSubjectIdPlaceholder"
    );
  });

  it("should render an error page when an error happens", async () => {
    const requestBody = {
      title: "Ms",
      givenName: "Irene",
      familyName: "Adler",
      nino: "QQ123456A",
    };
    const req = getMockReq({
      body: requestBody,
      query: {
        app: "any-app",
      },
    });
    const { res } = getMockRes();
    const ninoDocument = {
      credentialSubject: {
        name: [
          {
            nameParts: [
              { type: "Title", value: "Ms" },
              { type: "GivenName", value: "Irene" },
              { type: "FamilyName", value: "Adler" },
            ],
          },
        ],
        socialSecurityRecord: [{ personalNumber: "QQ123456A" }],
      },
      type: ["VerifiableCredential", "SocialSecurityCredential"],
    };
    jest
      .spyOn(NinoDocument, "fromRequestBody")
      .mockReturnValueOnce(ninoDocument);
    saveDocument.mockRejectedValueOnce(new Error("SOME_DATABASE_ERROR"));

    await ninoDocumentBuilderPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("500.njk");
  });
});
