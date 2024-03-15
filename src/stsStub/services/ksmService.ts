import {
  KMSClient,
  SignCommand,
  SignCommandInput,
  SignCommandOutput,
  SigningAlgorithmSpec,
} from "@aws-sdk/client-kms";

import { getKmsConfig } from "../../config/aws";

export class KmsService {
  constructor(
    private readonly keyId: string,
    private readonly signingAlgorithm: SigningAlgorithmSpec = "RSASSA_PKCS1_V1_5_SHA_256",
    private readonly kmsClient: KMSClient = new KMSClient(getKmsConfig())
  ) {}

  async sign(message: string): Promise<string> {
    const signCommandInput: SignCommandInput = {
      Message: Buffer.from(message),
      KeyId: this.keyId,
      SigningAlgorithm: this.signingAlgorithm,
      MessageType: "RAW",
    };
    const command = new SignCommand(signCommandInput);

    let response: SignCommandOutput;
    try {
      response = await this.kmsClient.send(command);
    } catch (error) {
      console.log(`Error signing the access token: ${error as Error}`);
      throw error;
    }

    if (!response.Signature) {
      throw new Error("No signature returned");
    }

    return this.parseSignature(response.Signature);
  }

  private parseSignature(rawSignature: Uint8Array): string {
    return Buffer.from(rawSignature).toString("base64url");
  }
}
