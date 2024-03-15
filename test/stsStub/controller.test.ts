import { stsStubController } from "../../src/stsStub/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";
import * as accessToken from "../../src/stsStub/token/accessToken";
import * as validateTokenRequest from "../../src/stsStub/token/validateTokenRequest";
import "dotenv/config";

jest.mock("../../src/stsStub/token/validateTokenRequest", () => ({
  validateGrantType: jest.fn(),
  getPreAuthorizedCodePayload: jest.fn(),
}));
jest.mock("../../src/stsStub/token/accessToken", () => ({
  getJwtAccessToken: jest.fn(),
}));

describe("controller.ts", () => {
  it("should return 200 and a bearer access token in the response body", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      body: {
        grant_type: "mock_grant_type",
        "pre-authorized_code": "mock_pre-authorized_code",
      },
    });

    const validateGrantType =
      validateTokenRequest.validateGrantType as jest.Mock;
    validateGrantType.mockReturnValueOnce(true);

    const getPreAuthorizedCodePayload =
      validateTokenRequest.getPreAuthorizedCodePayload as jest.Mock;
    getPreAuthorizedCodePayload.mockReturnValueOnce({ mock: "payload" });

    const createAccessToken = accessToken.getJwtAccessToken as jest.Mock;
    createAccessToken.mockReturnValueOnce(
      "eyJ0eXAiOiJKV1Qh.eyJzdWIiOiM.9nQevZ--Asqx5ltCWvw_AvVNDA"
    );

    await stsStubController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      access_token: "eyJ0eXAiOiJKV1Qh.eyJzdWIiOiM.9nQevZ--Asqx5ltCWvw_AvVNDA",
      expires_in: 180,
      token_type: "bearer",
    });
  });

  it("should return 400 if  request 'grant_type' is invalid", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });

    const validateGrantType =
      validateTokenRequest.validateGrantType as jest.Mock;
    validateGrantType.mockReturnValueOnce(false);

    await stsStubController(req, res);

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

    await stsStubController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid_grant",
    });
  });

  it("should return 500 if an unexpected error happens", async () => {
    const { res } = getMockRes();
    const req = getMockReq({
      params: { documentId: "testDocumentId" },
    });

    const validateGrantType =
      validateTokenRequest.validateGrantType as jest.Mock;
    validateGrantType.mockReturnValueOnce(true);

    const getPreAuthorizedCodePayload =
      validateTokenRequest.getPreAuthorizedCodePayload as jest.Mock;
    getPreAuthorizedCodePayload.mockReturnValueOnce({ mock: "payload" });

    const createAccessToken = accessToken.getJwtAccessToken as jest.Mock;
    createAccessToken.mockRejectedValueOnce(new Error("SOME_ERROR"));

    await stsStubController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "server_error",
    });
  });
});
