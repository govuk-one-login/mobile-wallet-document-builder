import { AccessTokenPayload } from "../types/AccessTokenPayload";
import { Jwt } from "../types/Jwt";
import { PreAuthorizedCodePayload } from "../types/PreAuthorizedCodePayload";
import { KmsService } from "../../services/kmsService";
import { randomUUID, UUID } from "node:crypto";

const ACCESS_TOKEN_SIGNING_ALGORITHM = "ES256";
const ACCESS_TOKEN_JWT_TYPE = "JWT";

export async function getJwtAccessToken(
    walletSubjectId: string,
    payload: PreAuthorizedCodePayload,
    signingKeyId: string,
    kmsService = new KmsService(signingKeyId)
): Promise<Jwt> {
  const accessTokenPayload = createAccessTokenPayload(
      walletSubjectId,
      payload,
      randomUUID()
  );

  return await createSignedAccessToken(
      accessTokenPayload,
      signingKeyId,
      ACCESS_TOKEN_SIGNING_ALGORITHM,
      ACCESS_TOKEN_JWT_TYPE,
      kmsService
  );
}

export function createAccessTokenPayload(
    walletSubjectId: string,
    payload: PreAuthorizedCodePayload,
    c_nonce: UUID
): AccessTokenPayload {
  return {
    sub: walletSubjectId,
    iss: payload.aud,
    aud: payload.iss,
    credential_identifiers: payload.credential_identifiers,
    c_nonce,
  };
}

export async function createSignedAccessToken(
    payload: AccessTokenPayload,
    keyId: string,
    alg: string,
    typ: string,
    kmsService: KmsService
): Promise<Jwt> {
  const header = { alg, typ, kid: keyId };
  const encodedHeader = base64Encoder(header);
  const encodedPayload = base64Encoder(payload);
  const message = `${encodedHeader}.${encodedPayload}`;
  const signature = await kmsService.sign(message);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function base64Encoder(object: object) {
  return Buffer.from(JSON.stringify(object)).toString("base64url");
}
