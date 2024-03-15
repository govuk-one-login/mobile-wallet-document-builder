import { JWTPayload } from "jose";
import { UUID } from "node:crypto";

export interface PreAuthorizedCodePayload extends JWTPayload {
  aud: string;
  iss: string;
  credential_identifiers: string[];
}

export interface AccessTokenPayload extends PreAuthorizedCodePayload {
  sub: string;
  c_nonce: UUID;
}

export type Jwt = `${string}.${string}.${string}`;
