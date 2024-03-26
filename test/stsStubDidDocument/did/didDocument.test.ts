import { DidDocument } from "../../../src/stsStubDidDocument/did/didDocument";

describe("didDocument.ts", () => {
  it("should return a DidDocument object", async () => {
    const response = new DidDocument(
      ["https://www.w3.org/ns/did/v1"],
      "did:web:wallet-api.test.gov.uk",
      [
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
      ["did:web:wallet-api.test.gov.uk#test-key-id"]
    );

    expect(response).toEqual({
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
});
