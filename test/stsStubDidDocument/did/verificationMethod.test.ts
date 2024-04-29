import { VerificationMethod } from "../../../src/stsStubDidDocument/did/verificationMethod";

describe("verificationMethod.ts", () => {
  it("should return a VerificationMethod object", async () => {
    const response = new VerificationMethod(
      "did:web:wallet-api.test.gov.uk#test-key-id",
      "JsonWebKey",
      "did:web:wallet-api.test.gov.uk",
      {
        kty: "EC",
        x: "A-oRroL1tmWN8lbEf1Zz9nJa3P9E0dQJ4Iwv_qOmFD8",
        y: "76st88TuKuI0dUMW9MPsfcZwkR2VX1c4klNK96M3QP8",
        crv: "P-256",
        kid: "test-key-id",
      }
    );

    expect(response).toEqual({
      controller: "did:web:wallet-api.test.gov.uk",
      id: "did:web:wallet-api.test.gov.uk#test-key-id",
      publicKeyJwk: {
        kid: "test-key-id",
        kty: "EC",
        x: "A-oRroL1tmWN8lbEf1Zz9nJa3P9E0dQJ4Iwv_qOmFD8",
        y: "76st88TuKuI0dUMW9MPsfcZwkR2VX1c4klNK96M3QP8",
        crv: "P-256",
      },
      type: "JsonWebKey",
    });
  });
});
