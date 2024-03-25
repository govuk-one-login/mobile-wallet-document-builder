import { mockClient } from "aws-sdk-client-mock";
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";
import { KmsService } from "../../../src/stsStub/services/kmsService";

const mockKmsClient = mockClient(KMSClient);

let kmsService: KmsService;

describe("kmsService.ts", () => {
  beforeEach(() => {
    kmsService = new KmsService(
      "mock_key_id",
      "RSASSA_PKCS1_V1_5_SHA_256",
      new KMSClient()
    );
    mockKmsClient.reset();
  });

  it("should throw an error when an error happens when calling KMS", async () => {
    mockKmsClient.on(SignCommand).rejects(new Error("SOME_KMS_ERROR"));
    await expect(kmsService.sign("mock_message_to_sign")).rejects.toThrow(
      "SOME_KMS_ERROR"
    );
  });

  it("should throw an error when KMS response has no signature", async () => {
    mockKmsClient.on(SignCommand).resolves({ Signature: undefined });
    await expect(kmsService.sign("mock_message_to_sign")).rejects.toThrow(
      "No signature returned"
    );
  });

  it("should throw an error when KMS response has no signature", async () => {
    mockKmsClient.on(SignCommand).resolves({ Signature: undefined });
    await expect(kmsService.sign("mock_message_to_sign")).rejects.toThrow(
      "No signature returned"
    );
  });

  it("should return a base64 encoded signature when call to KMS is successful", async () => {
    const mockSignature: Uint8Array = Buffer.from("mock_signature");
    mockKmsClient.on(SignCommand).resolves({ Signature: mockSignature });
    const response = await kmsService.sign("mock_message_to_sign");

    expect(response).toEqual("bW9ja19zaWduYXR1cmU");
  });
});
