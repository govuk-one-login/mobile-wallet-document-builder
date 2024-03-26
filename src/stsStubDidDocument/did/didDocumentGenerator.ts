import { KmsService } from "../../services/kmsService";
import { createPublicKey, JsonWebKey } from "node:crypto";
import { VerificationMethod } from "./verificationMethod";
import { DidDocument } from "./didDocument";

export class DidDocumentGenerator {
  private readonly DID_TYPE = "JsonWebKey";
  private readonly CONTEXT = [
    "https://www.w3.org/ns/did/v1",
    "https://www.w3.org/ns/security/jwk/v1",
  ];
  private kmsService: KmsService;
  private readonly keyId: string;
  private readonly didController: string;

  constructor(kmsService: KmsService, keyId: string, didController: string) {
    this.kmsService = kmsService;
    this.keyId = keyId;
    this.didController = didController;
  }

  public async run() {
    const id = this.didController;
    const verificationMethod = await this.buildVerificationMethod();
    const assertionMethod = verificationMethod.id;

    return new DidDocument(
      this.CONTEXT,
      id,
      [verificationMethod],
      [assertionMethod]
    );
  }

  async buildVerificationMethod() {
    const publicKey = await this.kmsService.getPublicKey();
    const jwk = this.createJwk(publicKey);

    const id = this.didController + "#" + this.keyId;
    return new VerificationMethod(id, this.DID_TYPE, this.didController, jwk);
  }

  private createJwk(publicKeyString: string): JsonWebKey {
    const publicKeyPem: string =
      "-----BEGIN PUBLIC KEY-----\n" +
      publicKeyString +
      "\n-----END PUBLIC KEY-----";

    try {
      const jwk = createPublicKey(publicKeyPem).export({ format: "jwk" });
      this.addKidToJwk(jwk);
      return jwk;
    } catch (error) {
      console.log(`Error creating JWK: ${error as Error}`);
      throw error;
    }
  }

  private addKidToJwk(jwk: JsonWebKey) {
    jwk.kid = this.keyId;
  }
}
