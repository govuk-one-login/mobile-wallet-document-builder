import { mockClient } from "aws-sdk-client-mock";
import {GetPublicKeyCommand, KMSClient, SignCommand} from "@aws-sdk/client-kms";
import { KmsService } from "../../src/services/kmsService";

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

  it("should throw an error when an error happens when calling KMS to sign token", async () => {
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

  it("should return a base64 encoded signature when call to KMS is successful", async () => {
    const mockSignature: Uint8Array = Buffer.from("mock_signature");
    mockKmsClient.on(SignCommand).resolves({ Signature: mockSignature });
    const response = await kmsService.sign("mock_message_to_sign");

    expect(response).toEqual("bW9ja19zaWduYXR1cmU");
  });

  it("should throw an error when an error happens when calling KMS to fetch public key" , async () => {
    mockKmsClient.on(GetPublicKeyCommand).rejects(new Error("SOME_KMS_ERROR"));

    await expect(kmsService.getPublicKey()).rejects.toThrow(
        "SOME_KMS_ERROR"
    );
  });

  it("should throw an error when KMS response has no public key", async () => {
    mockKmsClient.on(GetPublicKeyCommand).resolves({
      KeyId: "arn:aws:kms:eu-west-2:000000000000:key/2ced22e2-c15b-4e02-aa5f-7a10a2eaccc7",
      PublicKey: undefined,
      KeySpec: 'RSA_4096',
      KeyUsage: "SIGN_VERIFY",
      SigningAlgorithms: ["RSASSA_PKCS1_V1_5_SHA_256"],
    });

    await expect(kmsService.getPublicKey()).rejects.toThrow(
        "No public key returned"
    );
  });

  it("should return a base64 encoded public key when call to KMS is successful", async () => {
    mockKmsClient.on(GetPublicKeyCommand).resolves({
      KeyId: "arn:aws:kms:eu-west-2:000000000000:key/2ced22e2-c15b-4e02-aa5f-7a10a2eaccc7",
      PublicKey: Buffer.from(
          "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAuA1gxsWNOVSboz38+wAAeqKjq+yudtNpfg+xUuLKDLp+KcvYU84oSlxe1h4cCAwEAAQ==",
          "base64"
      ),
      KeySpec: 'RSA_4096',
      KeyUsage: "SIGN_VERIFY",
      SigningAlgorithms: ["RSASSA_PKCS1_V1_5_SHA_256"],
    });
    const response = await kmsService.getPublicKey();

    expect(response).toEqual("MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAuA1gxsWNOVSboz38+wAAeqKjq+yudtNpfg+xUuLKDLp+KcvYU84oSlxe1h4cCAwEAAQ=");
  });
});
