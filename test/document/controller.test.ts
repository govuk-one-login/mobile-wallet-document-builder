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

const documentId = "2e0fac05-4b38-480f-9cbd-b046eabe1e46";
const bucketName = "photosBucket";

const ninoData = {
  title: "Ms",
  givenName: "Irene",
  familyName: "Adler",
  nino: "QQ123456A",
};

const veteranCardData = {
  givenName: "Sarah Elizabeth",
  familyName: "Edwards-Smith",
  "dateOfBirth-day": "06",
  "dateOfBirth-month": "03",
  "dateOfBirth-year": "1975",
  "cardExpiryDate-day": "08",
  "cardExpiryDate-month": "04",
  "cardExpiryDate-year": "2029",
  serviceNumber: "25057386",
  serviceBranch: "HM Naval Service",
  photo: "s3://photosBucket/" + documentId,
};

const mdlData = {
  family_name: "Edwards-Smith",
  given_name: "Sarah Elizabeth",
  portrait: "s3://photosBucket/" + documentId,
  "birth-day": "06",
  "birth-month": "03",
  "birth-year": "1975",
  birth_place: "London",
  "issue-day": "08",
  "issue-month": "04",
  "issue-year": "2019",
  "expiry-day": "08",
  "expiry-month": "04",
  "expiry-year": "2029",
  issuing_authority: "DVLA",
  issuing_country: "United Kingdom (UK)",
  document_number: "25057386",
  resident_address: "Flat 11, Blashford, Adelaide Road",
  resident_postal_code: "NW3 3RX",
  resident_city: "London",
};

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 500 if an error happens when trying to process the request", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: documentId },
    });
    const getDocument = documentStore.getDocument as jest.Mock;
    getDocument.mockRejectedValueOnce(new Error("SOME_ERROR"));

    await documentController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 404 if the NINO document was not found", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: documentId },
    });
    getDocument.mockReturnValueOnce(undefined);

    await documentController(req, res);

    expect(getDocument).toHaveBeenCalledWith("testTable", documentId);
    expect(getPhoto).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 404 if the Veteran Card photo was not found", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: documentId },
    });
    getDocument.mockReturnValueOnce({
      documentId: documentId,
      data: veteranCardData,
      vcType: "digitalVeteranCard",
    });
    getPhoto.mockReturnValueOnce(undefined);

    await documentController(req, res);

    expect(getDocument).toHaveBeenCalledWith("testTable", documentId);
    expect(getPhoto).toHaveBeenCalledWith(documentId, bucketName);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 200 and the NINO document as JSON", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: documentId },
    });
    getDocument.mockReturnValueOnce({
      documentId: documentId,
      data: ninoData,
      vcType: "SocialSecurityCredential",
    });

    await documentController(req, res);

    expect(getDocument).toHaveBeenCalledWith("testTable", documentId);
    expect(getPhoto).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 and the Veteran Card document as JSON", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: documentId },
    });
    getDocument.mockReturnValueOnce({
      documentId: documentId,
      data: veteranCardData,
      vcType: "digitalVeteranCard",
    });
    const mockedPhoto = "mockBase64EncodedPhoto";
    getPhoto.mockReturnValueOnce(mockedPhoto);

    await documentController(req, res);

    const veteranCardDocumentWithPhoto = { ...veteranCardData };
    veteranCardDocumentWithPhoto.photo = mockedPhoto;

    expect(getDocument).toHaveBeenCalledWith("testTable", documentId);
    expect(getPhoto).toHaveBeenCalledWith(documentId, bucketName);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 and the mDL document as JSON", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: documentId },
    });
    getDocument.mockReturnValueOnce({
      documentId: documentId,
      data: mdlData,
      vcType: "mobileDrivingLicence",
    });
    const mockedPhoto = "mockBase64EncodedPhoto";
    getPhoto.mockReturnValueOnce(mockedPhoto);

    await documentController(req, res);

    const mobileDrivingLicenceDocumentWithPhoto = { ...mdlData };
    mobileDrivingLicenceDocumentWithPhoto.portrait = mockedPhoto;

    expect(getDocument).toHaveBeenCalledWith("testTable", documentId);
    expect(getPhoto).toHaveBeenCalledWith(documentId, bucketName);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
