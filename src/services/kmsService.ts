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
    private readonly signingAlgorithm: SigningAlgorithmSpec = "ECDSA_SHA_256",
    private readonly kmsClient: KMSClient = new KMSClient(getKmsConfig())
  ) {}

  async sign(message: string): Promise<string> {
    const signCommandInput: SignCommandInput = {
      Message: Buffer.from(message),
      KeyId: this.keyId,
      SigningAlgorithm: this.signingAlgorithm,
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

    return this.parseSignature(response.Signature);
  }

  private parseSignature(rawSignature: Uint8Array): string {
    const base64EncodedSignature =
      Buffer.from(rawSignature).toString("base64url");
    return format.derToJose(base64EncodedSignature, "ES256");
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

    return this.parsePublicKey(response.PublicKey as Uint8Array);
  }

  private parsePublicKey(publicKeyRaw: Uint8Array) {
    return Buffer.from(publicKeyRaw).toString("base64");
  }
}
