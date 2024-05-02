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
            kty: "EC",
            x: "A-oRroL1tmWN8lbEf1Zz9nJa3P9E0dQJ4Iwv_qOmFD8",
            y: "76st88TuKuI0dUMW9MPsfcZwkR2VX1c4klNK96M3QP8",
            crv: "P-256",
            kid: "2ced22e2-c15b-4e02-aa5f-7a10a2eaccc7",
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
            kty: "EC",
            x: "A-oRroL1tmWN8lbEf1Zz9nJa3P9E0dQJ4Iwv_qOmFD8",
            y: "76st88TuKuI0dUMW9MPsfcZwkR2VX1c4klNK96M3QP8",
            crv: "P-256",
            kid: "2ced22e2-c15b-4e02-aa5f-7a10a2eaccc7",
          },
          type: "JsonWebKey",
        },
      ],
    });
  });
});
