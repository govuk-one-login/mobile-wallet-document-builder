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
import {exportJWK, importX509, JWK} from "jose";
import {createPublicKey} from "node:crypto";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bs58 = require("bs58");

const ACCESS_TOKEN_SIGNING_ALGORITHM = "ES256";
const ACCESS_TOKEN_JWT_TYPE = "JWT";
const KEY_ID = "2ced22e2-c15b-4e02-aa5f-7a10a2eaccc7";

export async function getProofJwt(nonce: string): Promise<string> {
  const kmsService = new ProofJwtKmsService(KEY_ID)
  const publicKey = await kmsService.getPublicKey();
  console.log(publicKey)

  const algorithm = 'ES256'

  const x509 = `-----BEGIN CERTIFICATE-----
  MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEXOW0ZG089cZwzm04c5Czvij9rjNJW6lyPxe8AcOyJuY2dPQKsEVhj/4LZVzLxsL983z95jwFe3j9ikz4tShnhg==
-----END CERTIFICATE-----`
  //
  // const x509 = `-----BEGIN CERTIFICATE-----
  // ${publicKey}
  // -----END CERTIFICATE-----`


  const ecPublicKey = await importX509(x509, algorithm, {extractable: true})
  console.log(ecPublicKey)
  const publicJwk2 = await exportJWK(ecPublicKey)
  console.log(publicJwk2)

  const didKey = createDidKey(publicJwk2);


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

export class ProofJwtKmsService {
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
      return Buffer.from(response.PublicKey as Uint8Array).toString("base64");
    } catch (error) {
      console.log(`Error fetching public key: ${error as Error}`);
      throw error;
    }
  }
}

export function createDidKey(publicKeyJwk: JWK): string {
  const publicKeyBuffer = getPublicKeyFromJwk(publicKeyJwk);
  const compressedPublicKey = compress(publicKeyBuffer);

  const bytes = new Uint8Array(compressedPublicKey.length + 2);
  bytes[0] = 0x80;
  bytes[1] = 0x24;
  bytes.set(compressedPublicKey, 2);

  const base58EncodedKey = bs58.default.encode(bytes);
  return `did:key:z${base58EncodedKey}`;
}

function getPublicKeyFromJwk(publicKeyJwk: JWK) {
  return Buffer.concat([
    Buffer.from(publicKeyJwk.x!, "base64"),
    Buffer.from(publicKeyJwk.y!, "base64"),
  ]);
}

const compress = (publicKey: Uint8Array): Uint8Array => {
  const publicKeyHex = Buffer.from(publicKey).toString("hex");
  const xHex = publicKeyHex.slice(0, publicKeyHex.length / 2);
  const yHex = publicKeyHex.slice(publicKeyHex.length / 2, publicKeyHex.length);
  const xOctet = Uint8Array.from(Buffer.from(xHex, "hex"));
  const yOctet = Uint8Array.from(Buffer.from(yHex, "hex"));
  return compressEcPoint(xOctet, yOctet);
};

function compressEcPoint(x: Uint8Array, y: Uint8Array) {
  const compressedKey = new Uint8Array(x.length + 1);
  compressedKey[0] = 2 + (y[y.length - 1] & 1);

  compressedKey.set(x, 1);
  return compressedKey;
}