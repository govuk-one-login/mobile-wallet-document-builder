import { JWTPayload, decodeJwt } from "jose";
import { PreAuthorizedCodePayload } from "../types/PreAuthorizedCodePayload";

enum GrantType {
  PREAUTHORIZED_CODE = "urn:ietf:params:oauth:grant-type:pre-authorized_code",
}
export function validateGrantType(grantType: string): boolean {
  if (grantType !== GrantType.PREAUTHORIZED_CODE) {
    console.log("Invalid grant type");
    return false;
  }

  return true;
}

function IsValidIssuer(payload: JWTPayload) {
  return "iss" in payload && typeof payload.iss === "string";
}

function IsValidAudience(payload: JWTPayload) {
  return "aud" in payload && typeof payload.aud === "string";
}

function IsValidCredentialIdentifier(payload: JWTPayload) {
  return (
    Array.isArray(payload.credential_identifiers) &&
    typeof payload.credential_identifiers[0] === "string"
  );
}

export function getPreAuthorizedCodePayload(
  preAuthorizedCode: string
): false | PreAuthorizedCodePayload {
  let payload: PreAuthorizedCodePayload;

  try {
    payload = decodeJwt(preAuthorizedCode);
  } catch (error) {
    console.log(`Invalid pre-authorized code: Error decoding token: ${error}`);
    return false;
  }

  if (!IsValidIssuer(payload)) {
    console.log("Invalid JWT Issuer");
    return false;
  }

  if (!IsValidAudience(payload)) {
    console.log("Invalid JWT Audience");
    return false;
  }

  if (!IsValidCredentialIdentifier(payload)) {
    console.log("Invalid JWT Credential Identifier");
    return false;
  }

  return payload;
}
