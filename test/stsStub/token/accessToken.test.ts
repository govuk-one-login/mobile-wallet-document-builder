import {
  createSignedAccessToken,
  getJwtAccessToken,
  createAccessTokenPayload,
} from "../../../src/stsStub/token/accessToken";
import { KmsService } from "../../../src/stsStub/services/kmsService";
import "dotenv/config";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("1a0fac05-4b38-480f-9cbd-b046eabe1e22"),
}));

describe("accessToken.ts", () => {
  describe("createAccessTokenPayload", () => {
    it("should return the access token payload", async () => {
      const response = createAccessTokenPayload(
        "mock_wallet_subject_id",
        {
          iss: "mock_issuer",
          aud: "mock_aud",
          credential_identifiers: ["mock_credential_identifier"],
        },
        "1a0fac05-4b38-480f-9cbd-b046eabe1e22"
      );

      expect(response).toEqual({
        aud: "mock_aud",
        c_nonce: "1a0fac05-4b38-480f-9cbd-b046eabe1e22",
        credential_identifiers: ["mock_credential_identifier"],
        iss: "mock_issuer",
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
              aud: "mock_aud",
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
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1vY2tfa2V5X2lkIn0.eyJhdWQiOiJtb2NrX2F1ZCIsImNfbm9uY2UiOiIxYTBmYWMwNS00YjM4LTQ4MGYtOWNiZC1iMDQ2ZWFiZTFlMjIiLCJjcmVkZW50aWFsX2lkZW50aWZpZXJzIjpbIm1vY2tfY3JlZGVudGlhbF9pZGVudGlmaWVyIl0sImlzcyI6Im1vY2tfaXNzdWVyIiwic3ViIjoibW9ja193YWxsZXRfc3ViamVjdF9pZCJ9.mocked_signature"
      );
      expect(mockKmsService.sign).toHaveBeenCalledWith(
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1vY2tfa2V5X2lkIn0.eyJhdWQiOiJtb2NrX2F1ZCIsImNfbm9uY2UiOiIxYTBmYWMwNS00YjM4LTQ4MGYtOWNiZC1iMDQ2ZWFiZTFlMjIiLCJjcmVkZW50aWFsX2lkZW50aWZpZXJzIjpbIm1vY2tfY3JlZGVudGlhbF9pZGVudGlmaWVyIl0sImlzcyI6Im1vY2tfaXNzdWVyIiwic3ViIjoibW9ja193YWxsZXRfc3ViamVjdF9pZCJ9"
      );
    });
  });

  describe("getJwtAccessToken", () => {
    it("should return the JWT access token", async () => {
      const mockKmsService = {
        sign: jest.fn(() => Promise.resolve("mocked_signature")),
      };

      const response = await getJwtAccessToken(
          'mock_wallet_subject_id',
          {
              iss: "mock_issuer",
              aud: "mock_aud",
              credential_identifiers: ["mock_credential_identifier"],
          },
          "mock_key_id",
          mockKmsService as unknown as KmsService
      );

      expect(response).toEqual(
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1vY2tfa2V5X2lkIn0.eyJzdWIiOiJtb2NrX3dhbGxldF9zdWJqZWN0X2lkIiwiaXNzIjoibW9ja19pc3N1ZXIiLCJhdWQiOiJtb2NrX2F1ZCIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsibW9ja19jcmVkZW50aWFsX2lkZW50aWZpZXIiXSwiY19ub25jZSI6IjFhMGZhYzA1LTRiMzgtNDgwZi05Y2JkLWIwNDZlYWJlMWUyMiJ9.mocked_signature"
      );

    });
  });
});
