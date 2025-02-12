import { Request, Response } from "express";
import { getStsSigningKeyId } from "../config/appConfig";
import { KmsService } from "../services/kmsService";
import { logger } from "../middleware/logger";
import { createPublicKey, JsonWebKey } from "node:crypto";

export async function stsStubJwksController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const keyId = getStsSigningKeyId();
    const kmsService = new KmsService(keyId);
    const publicKey = await kmsService.getPublicKey();
    const jwk = createJwk(publicKey, keyId);

    const response = { keys: [] as JsonWebKey[] };
    response.keys.push(jwk);

    res.status(200).json(response);
    return;
  } catch (error) {
    logger.error(error, "An error happened getting the JWKs");
    res.status(500).json({ error: "server_error" });
    return;
  }
}

function createJwk(publicKeyString: string, keyId: string): JsonWebKey {
  const publicKeyPem: string =
    "-----BEGIN PUBLIC KEY-----\n" +
    publicKeyString +
    "\n-----END PUBLIC KEY-----";

  const keyObject = createPublicKey(publicKeyPem);
  const jwk = keyObject.export({ format: "jwk" });
  jwk.kid = keyId; // add 'kid' to JWK

  return jwk;
}
