import { AccessTokenPayload } from "../types/AccessTokenPayload";
import { Jwt } from "../types/Jwt";
import { PreAuthorizedCodePayload } from "../types/PreAuthorizedCodePayload";
import { KmsService } from "../../services/kmsService";
import { randomUUID, UUID } from "node:crypto";
import {base64Encoder} from "../../utils/base64Encoder";

const ACCESS_TOKEN_SIGNING_ALGORITHM = "ES256";
const ACCESS_TOKEN_JWT_TYPE = "JWT";
const ACCESS_TOKEN_KMS_SIGNING_ALGORITHM = "ECDSA_SHA_256";

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
  const signature = await kmsService.sign(message, ACCESS_TOKEN_KMS_SIGNING_ALGORITHM);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

