import {
  dbsDocumentBuilderGetController,
  dbsDocumentBuilderPostController,
} from "../../src/dbsDocumentBuilder/controller";
import { Document } from "../../src/dbsDocumentBuilder/models/documentBuilder";
import * as databaseService from "../../src/services/databaseService";
import { getMockReq, getMockRes } from "@jest-mock/express";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("2e0fac05-4b38-480f-9cbd-b046eabe1e46"),
}));
jest.mock("../../src/dbsDocumentBuilder/models/documentBuilder");
jest.mock("../../src/services/databaseService", () => ({
  saveDocument: jest.fn(),
}));

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const saveDocument = databaseService.saveDocument as jest.Mock;

  it("should render the form  for inputting document details", async () => {
    const req = getMockReq({
      query: {
        app: "any-app",
      },
    });
    const { res } = getMockRes();

    await dbsDocumentBuilderGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("document-details-form.njk", {
      selectedApp: "any-app",
    });
  });

  it("should redirect to the credential offer page", async () => {
    const req = getMockReq({
      body: {
        title: "Ms",
        givenName: "Irene",
        familyName: "Adler",
        nino: "QQ123456A",
      },
      query: {
        app: "any-app",
      },
    });
    const { res } = getMockRes();
    const document = {
      type: "testType",
      credentialSubject: "testCredentialSubject",
    } as unknown as Document;

    jest.spyOn(Document, "fromRequestBody").mockReturnValueOnce(document);

    await dbsDocumentBuilderPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      "/view-credential-offer/2e0fac05-4b38-480f-9cbd-b046eabe1e46?app=any-app"
    );
    expect(Document.fromRequestBody).toHaveBeenCalledWith({
      title: "Ms",
      givenName: "Irene",
      familyName: "Adler",
      nino: "QQ123456A",
    });
    expect(saveDocument).toHaveBeenCalledWith(
      {
        type: "testType",
        credentialSubject: "testCredentialSubject",
      },
      "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      "walletSubjectIdPlaceholder"
    );
  });

  it("should render an error page when an error happens", async () => {
    const req = getMockReq({
      body: {
        title: "Ms",
        givenName: "Irene",
        familyName: "Adler",
        nino: "QQ123456A",
      },
      query: {
        app: "any-app",
      },
    });
    const { res } = getMockRes();
    const document = {
      type: "testType",
      credentialSubject: "testCredentialSubject",
    } as unknown as Document;

    jest.spyOn(Document, "fromRequestBody").mockReturnValueOnce(document);
    saveDocument.mockRejectedValueOnce(new Error("SOME_DATABASE_ERROR"));

    await dbsDocumentBuilderPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("500.njk");
    expect(Document.fromRequestBody).toHaveBeenCalledWith({
      title: "Ms",
      givenName: "Irene",
      familyName: "Adler",
      nino: "QQ123456A",
    });
    expect(saveDocument).toHaveBeenCalledWith(
      { credentialSubject: "testCredentialSubject", type: "testType" },
      "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      "walletSubjectIdPlaceholder"
    );
  });
});
