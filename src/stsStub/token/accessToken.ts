import {
  AccessTokenPayload,
  Jwt,
  PreAuthorizedCodePayload,
} from "../types/interfaces";
import { KmsService } from "../services/ksmService";
import { UUID } from "node:crypto";

const ACCESS_TOKEN_SIGNING_ALGORITHM = "RS256";
const ACCESS_TOKEN_JWT_TYPE = "JWT";

export async function createAccessToken(
  walletSubjectId: string,
  payload: PreAuthorizedCodePayload,
  signingKeyId: string,
  c_nonce: UUID
): Promise<Jwt> {
  const accessTokenPayload = createAccessTokenPayload(
    walletSubjectId,
    payload,
    c_nonce
  );

  return await createSignedAccessToken(
    accessTokenPayload,
    signingKeyId,
    ACCESS_TOKEN_SIGNING_ALGORITHM,
    ACCESS_TOKEN_JWT_TYPE
  );
}

export function createAccessTokenPayload(
  walletSubjectId: string,
  payload: PreAuthorizedCodePayload,
  c_nonce: UUID
): AccessTokenPayload {
  return {
    sub: walletSubjectId,
    iss: payload.iss,
    aud: payload.aud,
    credential_identifiers: payload.credential_identifiers,
    c_nonce,
  };
}

export async function createSignedAccessToken(
  payload: PreAuthorizedCodePayload,
  keyId: string,
  alg: string,
  typ: string
): Promise<Jwt> {
  const header = { alg, typ, kid: keyId };
  const encodedHeader = base64Encoder(header);
  const encodedPayload = base64Encoder(payload);
  const message = `${encodedHeader}.${encodedPayload}`;
  const signature = await new KmsService(keyId).sign(message);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function base64Encoder(object: object) {
  return Buffer.from(JSON.stringify(object)).toString("base64url");
}
