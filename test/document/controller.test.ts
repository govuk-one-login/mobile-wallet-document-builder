import { documentController } from "../../src/document/controller";
import * as documentStore from "../../src/services/databaseService";
import * as s3Service from "../../src/services/s3Service";
import { getMockReq, getMockRes } from "@jest-mock/express";
process.env.DOCUMENTS_TABLE_NAME = "testTable";

jest.mock("../../src/services/databaseService", () => ({
  getDocument: jest.fn(),
}));
jest.mock("../../src/services/s3Service", () => ({
  getPhoto: jest.fn(),
}));
const getDocument = documentStore.getDocument as jest.Mock;
const getPhoto = s3Service.getPhoto as jest.Mock;

const ninoDocument = {
  type: ["VerifiableCredential", "SocialSecurityCredential"],
  credentialSubject: {
    name: [
      {
        nameParts: [
          { value: "Mr", type: "Title" },
          { value: "Sarah", type: "GivenName" },
          { value: "Edwards", type: "FamilyName" },
        ],
      },
    ],
    socialSecurityRecord: [{ personalNumber: "QQ123456C" }],
  },
};

const veteranCardDocument = {
  type: ["VerifiableCredential", "digitalVeteranCard"],
  credentialSubject: {
    name: [
      {
        nameParts: [
          { value: "Mr", type: "Title" },
          { value: "Sarah", type: "GivenName" },
          { value: "Edwards", type: "FamilyName" },
        ],
      },
    ],
    veteranCard: [{ photo: "s3://photosBucketName/fileName" }],
  },
};

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 500 if an error happens when trying to process the request", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });
    const getDocument = documentStore.getDocument as jest.Mock;
    getDocument.mockRejectedValueOnce(new Error("SOME_ERROR"));

    await documentController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 404 if the NINO document was not found", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });
    getDocument.mockReturnValueOnce(undefined);

    await documentController(req, res);

    expect(getDocument).toHaveBeenCalledWith("testTable", "testDocumentId");
    expect(getPhoto).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 404 if the Veteran Card photo was not found", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });
    getDocument.mockReturnValueOnce({
      vc: JSON.stringify(veteranCardDocument),
    });
    getPhoto.mockReturnValueOnce(undefined);

    await documentController(req, res);

    expect(getDocument).toHaveBeenCalledWith("testTable", "testDocumentId");
    expect(getPhoto).toHaveBeenCalledWith("fileName", "photosBucketName");
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 200 and the NINO document as JSON", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });
    getDocument.mockReturnValueOnce({
      vc: JSON.stringify(ninoDocument),
    });

    await documentController(req, res);

    expect(getDocument).toHaveBeenCalledWith("testTable", "testDocumentId");
    expect(getPhoto).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(ninoDocument);
  });

  it("should return 200 and the Veteran Card document as JSON", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });
    getDocument.mockReturnValueOnce({
      vc: JSON.stringify(veteranCardDocument),
    });
    const mockedPhoto = "mockBase64EncodedPhoto";
    getPhoto.mockReturnValueOnce(mockedPhoto);

    await documentController(req, res);

    const veteranCardDocumentWithPhoto = { ...veteranCardDocument };
    veteranCardDocumentWithPhoto.credentialSubject.veteranCard[0].photo =
      mockedPhoto;

    expect(getDocument).toHaveBeenCalledWith("testTable", "testDocumentId");
    expect(getPhoto).toHaveBeenCalledWith("fileName", "photosBucketName");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(veteranCardDocumentWithPhoto);
  });
});
