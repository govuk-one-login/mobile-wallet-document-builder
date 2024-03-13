import { documentGet } from "../../src/document/controller";
import * as documentStore from "../../src/database/documentStore";
import { getMockReq, getMockRes } from "@jest-mock/express";

jest.mock("../../src/database/documentStore", () => ({
  getDocumentFromDatabase: jest.fn(),
}));

describe("controller.ts", () => {
  it("should return 200 and the document as JSON", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });

    const getDocument = documentStore.getDocumentFromDatabase as jest.Mock;
    getDocument.mockReturnValueOnce({
      vc: JSON.stringify({
        type: "testType",
        credentialSubject: "testCredentialSubject",
      }),
    });

    await documentGet(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      credentialSubject: "testCredentialSubject",
      type: "testType",
    });
    expect(getDocument).toHaveBeenCalledWith("testDocumentId");
  });

  it("should return 204 if the document was not found", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });

    const getDocument = documentStore.getDocumentFromDatabase as jest.Mock;
    getDocument.mockReturnValueOnce(undefined);

    await documentGet(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("should return 500 if an error happens", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });

    const getDocument = documentStore.getDocumentFromDatabase as jest.Mock;
    getDocument.mockRejectedValueOnce(new Error("SOME_ERROR"));

    await documentGet(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
