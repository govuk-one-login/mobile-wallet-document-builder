import { KmsService } from "../../../src/services/kmsService";
import { DidDocumentBuilder } from "../../../src/stsStubDidDocument/did/didDocumentBuilder";
import crypto from "node:crypto";
jest.mock("node:crypto", () => {
  const originalCrypto = jest.requireActual("crypto");
  return {
    ...originalCrypto,
    createPublicKey: jest.fn(),
  };
});

describe("didDocumentBuilder.ts", () => {
  it("should return the DID document", async () => {
    const mockKmsService = {
      getPublicKey: jest.fn(() =>
        Promise.resolve("MvCT45FiWj+fxTzme9DuCuhr3oqgWmC")
      ),
    };
    (crypto.createPublicKey as jest.Mock).mockImplementation(() => ({
      export: jest.fn().mockImplementation(() => ({
        kty: "RSA",
        n: "Jvg2QoTvxTuNdmRHvX8wDTOKgDYp31knC5K",
        e: "AQAB",
      })),
    }));

    const didDocumentBuilder = new DidDocumentBuilder(
      mockKmsService as unknown as KmsService,
      "test-key-id",
      "did:web:wallet-api.test.gov.uk"
    );

    const response = await didDocumentBuilder.buildDidDocument();

    expect(crypto.createPublicKey).toHaveBeenCalledWith(
      "-----BEGIN PUBLIC KEY-----\nMvCT45FiWj+fxTzme9DuCuhr3oqgWmC\n-----END PUBLIC KEY-----"
    );
    expect(response).toEqual({
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://www.w3.org/ns/security/jwk/v1",
      ],
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
            n: "Jvg2QoTvxTuNdmRHvX8wDTOKgDYp31knC5K",
          },
          type: "JsonWebKey",
        },
      ],
    });
  });

  it("should throw an error when exporting public key as a JWK throws an error", async () => {
    const mockKmsService = {
      getPublicKey: jest.fn(() =>
        Promise.resolve("MvCT45FiWj+fxTzme9DuCuhr3oqgWmC")
      ),
    };
    (crypto.createPublicKey as jest.Mock).mockImplementation(() => ({
      export: jest.fn().mockImplementationOnce(() => {
        throw new Error("SOME_CRYPTO_ERROR");
      }),
    }));

    const didDocumentBuilder = new DidDocumentBuilder(
      mockKmsService as unknown as KmsService,
      "test-key-id",
      "did:web:wallet-api.test.gov.uk"
    );

    await expect(didDocumentBuilder.buildDidDocument()).rejects.toThrow(
      "SOME_CRYPTO_ERROR"
    );
  });
});
