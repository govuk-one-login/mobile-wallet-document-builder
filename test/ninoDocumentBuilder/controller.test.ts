import * as databaseService from "../../src/services/databaseService";
import { getMockReq, getMockRes } from "@jest-mock/express";
import {
  ninoDocumentBuilderGetController,
  ninoDocumentBuilderPostController,
} from "../../src/ninoDocumentBuilder/controller";
process.env.DOCUMENTS_TABLE_NAME = "testTable";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("2e0fac05-4b38-480f-9cbd-b046eabe1e46"),
}));
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
      credentialTtl: "525600",
      throwError: "",
    };

    const saveDocument = databaseService.saveDocument as jest.Mock;

    describe("given an error happens trying to process the request", () => {
      it("should render the error page", async () => {
        saveDocument.mockRejectedValueOnce(new Error("SOME_DATABASE_ERROR"));
        const req = getMockReq({
          body: requestBody,
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
        });
        const { res } = getMockRes();

        await ninoDocumentBuilderPostController(req, res);

        expect(saveDocument).toHaveBeenCalledWith("testTable", {
          documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          data: {
            title: "Ms",
            givenName: "Irene",
            familyName: "Adler",
            nino: "QQ123456A",
            credentialTtlMinutes: 525600,
          },
          vcType: "SocialSecurityCredential",
        });
      });
    });

    describe("given the document has been saved successfully", () => {
      describe("when an error scenario has not been selected", () => {
        it("should redirect to the credential offer page with only 'SocialSecurityCredential' in the query params", async () => {
          const req = getMockReq({
            body: requestBody,
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
          });
          const { res } = getMockRes();

          await ninoDocumentBuilderPostController(req, res);

          expect(res.redirect).toHaveBeenCalledWith(
            "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=SocialSecurityCredential&error=ERROR:401",
          );
        });
      });
    });
    describe("when an error scenario has been selected", () => {
      it.each(["ERROR:500", "ERROR:401", "ERROR:CLIENT", "ERROR:GRANT"])(
        "should redirect with the correct error parameter when selectedError is '%s'",
        async (selectedError) => {
          const req = getMockReq({
            body: { ...requestBody, ...{ throwError: selectedError } },
          });
          const { res } = getMockRes();
          await ninoDocumentBuilderPostController(req, res);

          const expectedRedirect =
            selectedError === "SOME_OTHER_ERROR"
              ? "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=BasicCheckCredential&error="
              : `/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?type=BasicCheckCredential&error=${selectedError}`;

          expect(res.redirect).toHaveBeenCalledWith(expectedRedirect);
        },
      );
    });
  });
});
