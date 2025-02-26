import { NinoDocument } from "../../src/ninoDocumentBuilder/models/ninoDocument";
import * as databaseService from "../../src/services/databaseService";
import { getMockReq, getMockRes } from "@jest-mock/express";
import {
  ninoDocumentBuilderGetController,
  ninoDocumentBuilderPostController,
} from "../../src/ninoDocumentBuilder/controller";
process.env.DOCUMENTS_TABLE_NAME = "testTable";
process.env.DOCUMENTS_V2_TABLE_NAME = "testTable2";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("2e0fac05-4b38-480f-9cbd-b046eabe1e46"),
}));
jest.mock("../../src/ninoDocumentBuilder/models/ninoDocument");
jest.mock("../../src/services/databaseService", () => ({
  saveDocument: jest.fn(),
}));

describe("controller.ts", () => {
  describe("get", () => {
    it("should render the form for inputting NINO document details when user is not authenticated (no id_token in cookies)", async () => {
      const req = getMockReq({ cookies: {} });
      const { res } = getMockRes();

      await ninoDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith(
        "nino-document-details-form.njk",
        {
          authenticated: false,
        },
      );
    });

    it("should render the form for inputting NINO document details when user is authenticated", async () => {
      const req = getMockReq({ cookies: { id_token: "id_token" } });
      const { res } = getMockRes();

      await ninoDocumentBuilderGetController(req, res);

      expect(res.render).toHaveBeenCalledWith(
        "nino-document-details-form.njk",
        {
          authenticated: true,
        },
      );
    });
  });

  describe("post", () => {
    const requestBody = {
      title: "Ms",
      givenName: "Irene",
      familyName: "Adler",
      nino: "QQ123456A",
      throwError: "",
    };

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
    jest.spyOn(NinoDocument, "fromRequestBody").mockReturnValue(ninoDocument);

    const saveDocument = databaseService.saveDocument as jest.Mock;

    describe("given an error happens trying to process the request", () => {
      it("should render the error page", async () => {
        saveDocument.mockRejectedValueOnce(new Error("SOME_DATABASE_ERROR"));
        const req = getMockReq({
          body: requestBody,
          cookies: { dataModel: "v2.0" },
        });
        const { res } = getMockRes();

        await ninoDocumentBuilderPostController(req, res);

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

        await ninoDocumentBuilderPostController(req, res);

        expect(saveDocument).toHaveBeenNthCalledWith(1, "testTable", {
          documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          vc: JSON.stringify({
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
          }),
        });
        expect(saveDocument).toHaveBeenNthCalledWith(2, "testTable2", {
          documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          data: {
            title: "Ms",
            givenName: "Irene",
            familyName: "Adler",
            nino: "QQ123456A",
          },
          vcDataModel: "v2.0",
          vcType: "SocialSecurityCredential",
        });
      });
    });

    describe("given the document has been saved successfully", () => {
      describe("when an error scenario has not been selected", () => {
        it("should redirect to the credential offer page with only 'SocialSecurityCredential' in the query params", async () => {
          const req = getMockReq({
            body: requestBody,
            cookies: { dataModel: "v2.0" },
          });
          const { res } = getMockRes();

          await ninoDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=SocialSecurityCredential&error=",
          );
        });
      });

      describe("when the error scenario 'ERROR:500' has been selected", () => {
        it("should redirect to the credential offer page with 'SocialSecurityCredential' and 'ERROR:401' in the query params", async () => {
          const req = getMockReq({
            body: {
              ...requestBody,
              ...{ throwError: "ERROR:401" },
            },
            cookies: { dataModel: "v2.0" },
          });
          const { res } = getMockRes();

          await ninoDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=SocialSecurityCredential&error=ERROR:401",
          );
        });
      });
    });
  });
});
