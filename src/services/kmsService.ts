import {
  GetPublicKeyCommand,
  GetPublicKeyResponse,
  KMSClient,
  SignCommand,
  SignCommandInput,
  SignCommandOutput,
  SigningAlgorithmSpec,
} from "@aws-sdk/client-kms";
import { getKmsConfig } from "../config/aws";
import format from "ecdsa-sig-formatter";
import { logger } from "../middleware/logger";

export class KmsService {
  constructor(
    private readonly keyId: string,
    private readonly kmsClient: KMSClient = new KMSClient(getKmsConfig())
  ) {}

  async sign(
    message: string,
    signingAlgorithm: SigningAlgorithmSpec
  ): Promise<string> {
    const signCommandInput: SignCommandInput = {
      Message: Buffer.from(message),
      KeyId: this.keyId,
      SigningAlgorithm: signingAlgorithm,
      MessageType: "RAW",
    };
    const command: SignCommand = new SignCommand(signCommandInput);

    let response: SignCommandOutput;
    try {
      response = await this.kmsClient.send(command);
    } catch (error) {
      logger.error("Error signing token with KMS");
      throw error;
    }

    if (!response.Signature) {
      throw new Error("No signature returned");
    }

    const base64EncodedSignature = Buffer.from(response.Signature).toString(
      "base64url"
    );

    if (signingAlgorithm.startsWith("RSA")) {
      return base64EncodedSignature;
    } else {
      return format.derToJose(base64EncodedSignature, "ES256");
    }
  }

  public async getPublicKey() {
    const command: GetPublicKeyCommand = new GetPublicKeyCommand({
      KeyId: this.keyId,
    });

    let response: GetPublicKeyResponse;
    try {
      response = await this.kmsClient.send(command);
    } catch (error) {
      logger.error("Error fetching public key from KMS");
      throw error;
    }

    if (!response.PublicKey) {
      throw new Error("No public key returned");
    }

    return this.parsePublicKey(response.PublicKey);
  }

  private parsePublicKey(publicKeyRaw: Uint8Array) {
    return Buffer.from(publicKeyRaw).toString("base64");
  }
}
