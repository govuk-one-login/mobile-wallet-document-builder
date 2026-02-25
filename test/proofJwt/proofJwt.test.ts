import { mockClient } from "aws-sdk-client-mock";
import {
  GetPublicKeyCommand,
  KMSClient,
  SignCommand,
} from "@aws-sdk/client-kms";
process.env.ENVIRONMENT = "test";
import { getProofJwt } from "../../src/proofJwt/proofJwt";
import format from "ecdsa-sig-formatter";

const mockKmsClient = mockClient(KMSClient);

describe("getProofJwt", () => {
  beforeEach(() => {
    mockKmsClient.reset();
  });

  it("should return header.payload.signature on success", async () => {
    mockKmsClient.on(GetPublicKeyCommand).resolves({
      PublicKey: Buffer.from(
        "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAECO6A8rvNKD/sVNQwswdrIwR5ThN0gEc1rHtRzs5BXVvQ21bG1y7/b97RcxzbcQH+P2ti2DhwGiM/HwN5Agtg/Q==",
        "base64",
      ),
    });

    const mockSignature = Buffer.from(
      "yA4WNemRpUreSh9qgMh_ePGqhgn328ghJ_HG7WOBKQV98eFNm3FIvweoiSzHvl49Z6YTdV4Up7NDD7UcZ-52cw",
      "base64",
    );
    const mockSignatureDer = format.joseToDer(mockSignature, "ES256");
    mockKmsClient.on(SignCommand).resolves({ Signature: mockSignatureDer });

    const result = await getProofJwt(
      "test-nonce",
      "test-audience",
      "test-keyId",
    );

    const parts = result.split(".");
    console.log(parts);

    expect(parts).toHaveLength(3);
  });
});
