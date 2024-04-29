import { VerificationMethod } from "../../../src/stsStubDidDocument/did/verificationMethod";

describe("verificationMethod.ts", () => {
  it("should return a VerificationMethod object", async () => {
    const response = new VerificationMethod(
      "did:web:wallet-api.test.gov.uk#test-key-id",
      "JsonWebKey",
      "did:web:wallet-api.test.gov.uk",
      {
        kty: "RSA",
        n: "uA1gxsWNOVSboz38-wAAeqKjqH7DuG8f19YrWZhBVQsDIa-I_PDNTm4c",
        e: "AQAB",
        kid: "test-key-id",
      }
    );

    expect(response).toEqual({
      controller: "did:web:wallet-api.test.gov.uk",
      id: "did:web:wallet-api.test.gov.uk#test-key-id",
      publicKeyJwk: {
        e: "AQAB",
        kid: "test-key-id",
        kty: "RSA",
        n: "uA1gxsWNOVSboz38-wAAeqKjqH7DuG8f19YrWZhBVQsDIa-I_PDNTm4c",
      },
      type: "JsonWebKey",
    });
  });
});
