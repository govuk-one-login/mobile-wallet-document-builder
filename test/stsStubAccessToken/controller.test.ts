process.env.STS_SIGNING_KEY_ID = "mock_signing_key_id";
process.env.ACCESS_TOKEN_TTL_IN_SECS = "100";
import { stsStubAccessTokenController } from "../../src/stsStubAccessToken/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";
// import * as accessToken from "../../src/stsStubAccessToken/token/accessToken";
import * as validateTokenRequest from "../../src/stsStubAccessToken/token/validateTokenRequest";

jest.mock("../../src/stsStubAccessToken/token/validateTokenRequest", () => ({
  validateGrantType: jest.fn(),
  getPreAuthorizedCodePayload: jest.fn(),
}));
jest.mock("../../src/stsStubAccessToken/token/accessToken", () => ({
  getJwtAccessToken: jest.fn(),
}));

describe("controller.ts", () => {
  // it("should return 200 and a bearer access token in the response body", async () => {
  //   const { res } = getMockRes();
  //   const req = getMockReq({
  //     body: {
  //       grant_type: "mock_grant_type",
  //       "pre-authorized_code": "mock_pre-authorized_code",
  //     },
  //   });
  //
  //   const validateGrantType =
  //     validateTokenRequest.validateGrantType as jest.Mock;
  //   validateGrantType.mockReturnValueOnce(true);
  //
  //   const getPreAuthorizedCodePayload =
  //     validateTokenRequest.getPreAuthorizedCodePayload as jest.Mock;
  //   getPreAuthorizedCodePayload.mockReturnValueOnce({ mock: "payload" });
  //
  //   const createAccessToken = accessToken.getJwtAccessToken as jest.Mock;
  //   createAccessToken.mockReturnValueOnce(
  //     "eyJ0eXAiOiJKV1Qh.eyJzdWIiOiM.9nQevZ--Asqx5ltCWvw_AvVNDA"
  //   );
  //
  //   await stsStubAccessTokenController(req, res);
  //
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({
  //     access_token: "eyJ0eXAiOiJKV1Qh.eyJzdWIiOiM.9nQevZ--Asqx5ltCWvw_AvVNDA",
  //     expires_in: 100,
  //     token_type: "bearer",
  //   });
  // });

  it("should return 400 if  request 'grant_type' is invalid", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });

    const validateGrantType =
      validateTokenRequest.validateGrantType as jest.Mock;
    validateGrantType.mockReturnValueOnce(false);

    await stsStubAccessTokenController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid_grant",
    });
  });

  it("should return 400 if request 'pre-authorized_code' is invalid", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });

    const validateGrantType =
      validateTokenRequest.validateGrantType as jest.Mock;
    validateGrantType.mockReturnValueOnce(true);

    const getPreAuthorizedCodePayload =
      validateTokenRequest.getPreAuthorizedCodePayload as jest.Mock;
    getPreAuthorizedCodePayload.mockReturnValueOnce(false);

    await stsStubAccessTokenController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid_grant",
    });
  });

  // it("should return 500 if an unexpected error happens", async () => {
  //   const { res } = getMockRes();
  //   const req = getMockReq({
  //     params: { documentId: "testDocumentId" },
  //   });
  //
  //   const validateGrantType =
  //     validateTokenRequest.validateGrantType as jest.Mock;
  //   validateGrantType.mockReturnValueOnce(true);
  //
  //   const getPreAuthorizedCodePayload =
  //     validateTokenRequest.getPreAuthorizedCodePayload as jest.Mock;
  //   getPreAuthorizedCodePayload.mockReturnValueOnce({ mock: "payload" });
  //
  //   const createAccessToken = accessToken.getJwtAccessToken as jest.Mock;
  //   createAccessToken.mockRejectedValueOnce(new Error("SOME_ERROR"));
  //
  //   await stsStubAccessTokenController(req, res);
  //
  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({
  //     error: "server_error",
  //   });
  // });
});
