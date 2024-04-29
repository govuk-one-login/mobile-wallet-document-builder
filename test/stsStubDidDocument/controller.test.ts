process.env.STS_SIGNING_KEY_ID = "mock_signing_key_id";
process.env.DID_CONTROLLER = "did:web:wallet-api.test.gov.uk";
import { stsStubDidDocumentController } from "../../src/stsStubDidDocument/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { DidDocumentBuilder } from "../../src/stsStubDidDocument/did/didDocumentBuilder";

jest.mock("../../src/stsStubDidDocument/did/didDocumentBuilder");
jest.mock("../../src/services/kmsService");

describe("controller.ts", () => {
  it("should return 200 and the did:web document in the response body", async () => {
    const { res } = getMockRes();
    const req = getMockReq();

    jest
      .spyOn(DidDocumentBuilder.prototype, "buildDidDocument")
      .mockResolvedValueOnce({
        "@context": ["https://www.w3.org/ns/did/v1"],
        assertionMethod: ["did:web:wallet-api.test.gov.uk#test-key-id"],
        id: "did:web:wallet-api.test.gov.uk",
        verificationMethod: [
          {
            controller: "did:web:wallet-api.test.gov.uk",
            id: "did:web:wallet-api.test.gov.uk#test-key-id",
            publicKeyJwk: {
              e: "AQAB",
              kid: "test-key-id",
              kty: "RSA",
              n: "uA1gxsWNOVSboz38-wAAeqKjqH7DuG8f19YrWZhBVQsDIa-I_PDNTm4c",
            },
            type: "JsonWebKey",
          },
        ],
      });

    await stsStubDidDocumentController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      "@context": ["https://www.w3.org/ns/did/v1"],
      assertionMethod: ["did:web:wallet-api.test.gov.uk#test-key-id"],
      id: "did:web:wallet-api.test.gov.uk",
      verificationMethod: [
        {
          controller: "did:web:wallet-api.test.gov.uk",
          id: "did:web:wallet-api.test.gov.uk#test-key-id",
          publicKeyJwk: {
            e: "AQAB",
            kid: "test-key-id",
            kty: "RSA",
            n: "uA1gxsWNOVSboz38-wAAeqKjqH7DuG8f19YrWZhBVQsDIa-I_PDNTm4c",
          },
          type: "JsonWebKey",
        },
      ],
    });
  });

  it("should return 500 if an unexpected error happens", async () => {
    const { res } = getMockRes();
    const req = getMockReq();

    jest
      .spyOn(DidDocumentBuilder.prototype, "buildDidDocument")
      .mockRejectedValueOnce(new Error("SOME_ERROR"));

    await stsStubDidDocumentController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "server_error" });
  });
});
