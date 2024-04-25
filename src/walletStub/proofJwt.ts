import { Jwt } from "../stsStubAccessToken/types/Jwt";
import {
  GetPublicKeyCommand,
  GetPublicKeyResponse,
  KMSClient,
  SignCommand,
  SignCommandOutput,
  SigningAlgorithmSpec,
} from "@aws-sdk/client-kms";
import { getKmsConfig } from "../config/aws";
import format from 'ecdsa-sig-formatter';

const ACCESS_TOKEN_SIGNING_ALGORITHM = "ES256";
const ACCESS_TOKEN_JWT_TYPE = "JWT";
const KEY_ID = "aa275b92-0def-4dfc-b0f6-87c96b26c6c7";

export async function getProofJwt(nonce: string): Promise<Jwt> {
  const kmsService = new WalletStubKmsService(KEY_ID)
  const publicKey = await kmsService.getPublicKey();
  const didKey = "did:key:" + publicKey;

  const header = {alg: ACCESS_TOKEN_SIGNING_ALGORITHM, typ: ACCESS_TOKEN_JWT_TYPE, kid: didKey};
  const encodedHeader = base64Encoder(header);
  const payload = {iss: "urn:fdc:gov:uk:wallet", aud: "urn:fdc:gov:uk:example-credential-issuer", iat: Date.now(), nonce: nonce};
  const encodedPayload = base64Encoder(payload);
  const message = `${encodedHeader}.${encodedPayload}`;

  const signature = await kmsService.sign(message);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function base64Encoder(object: object) {
  return Buffer.from(JSON.stringify(object)).toString("base64url");
}

export class WalletStubKmsService {
  constructor(
      private readonly keyId: string,
      private readonly signingAlgorithm: SigningAlgorithmSpec = "ECDSA_SHA_256",
      private readonly kmsClient: KMSClient = new KMSClient(getKmsConfig())
  ) {}

  async sign(message: string): Promise<string> {
    const command: SignCommand = new SignCommand({
      Message: Buffer.from(message),
      KeyId: this.keyId,
      SigningAlgorithm: this.signingAlgorithm,
      MessageType: "RAW",
    });

    try {
      const response: SignCommandOutput = await this.kmsClient.send(command);
      console.log(response)
     const base64EncodedSignature = Buffer.from(response.Signature!).toString("base64url");
     return format.derToJose(base64EncodedSignature, 'ES256');

    } catch (error) {
      console.log(`Error signing token: ${error as Error}`);
      throw error;
    }
  }

  public async getPublicKey() {
    const command: GetPublicKeyCommand = new GetPublicKeyCommand({
      KeyId: this.keyId,
    });

    try {
      const response: GetPublicKeyResponse = await this.kmsClient.send(command);
      console.log(response.PublicKey)
      return Buffer.from(response.PublicKey as Uint8Array).toString("base64");
    } catch (error) {
      console.log(`Error fetching public key: ${error as Error}`);
      throw error;
    }
  }
}
