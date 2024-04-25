import {
  createSignedAccessToken,
  getJwtAccessToken,
  createAccessTokenPayload,
} from "../../../src/stsStubAccessToken/token/accessToken";
import { KmsService } from "../../../src/services/kmsService";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("1a0fac05-4b38-480f-9cbd-b046eabe1e22"),
}));

describe("proofJwt.ts", () => {
  describe("createAccessTokenPayload", () => {
    it("should return the access token payload", async () => {
      const response = createAccessTokenPayload(
        "mock_wallet_subject_id",
        {
          iss: "mock_issuer",
          aud: "mock_audience",
          credential_identifiers: ["mock_credential_identifier"],
        },
        "1a0fac05-4b38-480f-9cbd-b046eabe1e22"
      );

      expect(response).toEqual({
        aud: "mock_issuer",
        c_nonce: "1a0fac05-4b38-480f-9cbd-b046eabe1e22",
        credential_identifiers: ["mock_credential_identifier"],
        iss: "mock_audience",
        sub: "mock_wallet_subject_id",
      });
    });
  });

  describe("createSignedAccessToken", () => {
    it("should successfully sign the access token and return the JWT", async () => {
      const mockKmsService = {
        sign: jest.fn(() => Promise.resolve("mocked_signature")),
      };

      const response = await createSignedAccessToken(
        {
          aud: "mock_audience",
          c_nonce: "1a0fac05-4b38-480f-9cbd-b046eabe1e22",
          credential_identifiers: ["mock_credential_identifier"],
          iss: "mock_issuer",
          sub: "mock_wallet_subject_id",
        },
        "mock_key_id",
        "RS256",
        "JWT",
        mockKmsService as unknown as KmsService
      );

      expect(response).toEqual(
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1vY2tfa2V5X2lkIn0.eyJhdWQiOiJtb2NrX2F1ZGllbmNlIiwiY19ub25jZSI6IjFhMGZhYzA1LTRiMzgtNDgwZi05Y2JkLWIwNDZlYWJlMWUyMiIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsibW9ja19jcmVkZW50aWFsX2lkZW50aWZpZXIiXSwiaXNzIjoibW9ja19pc3N1ZXIiLCJzdWIiOiJtb2NrX3dhbGxldF9zdWJqZWN0X2lkIn0.mocked_signature"
      );
      expect(mockKmsService.sign).toHaveBeenCalledWith(
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1vY2tfa2V5X2lkIn0.eyJhdWQiOiJtb2NrX2F1ZGllbmNlIiwiY19ub25jZSI6IjFhMGZhYzA1LTRiMzgtNDgwZi05Y2JkLWIwNDZlYWJlMWUyMiIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsibW9ja19jcmVkZW50aWFsX2lkZW50aWZpZXIiXSwiaXNzIjoibW9ja19pc3N1ZXIiLCJzdWIiOiJtb2NrX3dhbGxldF9zdWJqZWN0X2lkIn0"
      );
    });
  });

  describe("getJwtAccessToken", () => {
    it("should return the JWT access token", async () => {
      const mockKmsService = {
        sign: jest.fn(() => Promise.resolve("mocked_signature")),
      };

      const response = await getJwtAccessToken(
        "mock_wallet_subject_id",
        {
          iss: "mock_issuer",
          aud: "mock_audience",
          credential_identifiers: ["mock_credential_identifier"],
        },
        "mock_key_id",
        mockKmsService as unknown as KmsService
      );

      expect(response).toEqual(
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1vY2tfa2V5X2lkIn0.eyJzdWIiOiJtb2NrX3dhbGxldF9zdWJqZWN0X2lkIiwiaXNzIjoibW9ja19hdWRpZW5jZSIsImF1ZCI6Im1vY2tfaXNzdWVyIiwiY3JlZGVudGlhbF9pZGVudGlmaWVycyI6WyJtb2NrX2NyZWRlbnRpYWxfaWRlbnRpZmllciJdLCJjX25vbmNlIjoiMWEwZmFjMDUtNGIzOC00ODBmLTljYmQtYjA0NmVhYmUxZTIyIn0.mocked_signature"
      );
    });
  });
});
