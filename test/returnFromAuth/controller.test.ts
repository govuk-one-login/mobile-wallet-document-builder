import { getMockReq, getMockRes } from "@jest-mock/express";
import { returnFromAuthGetController } from "../../src/returnFromAuth/controller";
import { logger } from "../../src/middleware/logger";
import * as assertionJwt from "../../src/returnFromAuth/clientAssertion/buildClientAssertion";

process.env.COOKIE_TTL_IN_SECS = "100";
process.env.CLIENT_SIGNING_KEY_ID = "14122ec4-cdd0-4154-8275-04363c15fbd9";

jest.mock(
  "../../src/returnFromAuth/clientAssertion/buildClientAssertion",
  () => ({
    buildClientAssertion: jest.fn(),
  }),
);

describe("controller.ts", () => {
  const buildAssertionJwt = assertionJwt.buildClientAssertion as jest.Mock;
  const loggerErrorSpy = jest
    .spyOn(logger, "error")
    .mockImplementation(() => undefined);

  beforeEach(() => {
    loggerErrorSpy.mockReset();
  });

  it("should return 500 on OAuth error in query parameters", async () => {
    const req = getMockReq({
      query: { error: "access_denied", error_description: "some description" },
    });
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    expect(loggerErrorSpy).toHaveBeenNthCalledWith(
      1,
      "OAuth authorization failed",
      { error: "access_denied", error_description: "some description" },
    );
    expect(res.render).toHaveBeenCalledWith("500.njk");
  });

  it("should return 500 on OIDC callback failure", async () => {
    const error = new Error("Token exchange failed");
    const req = getMockReq({
      oidc: {
        callbackParams: jest.fn(),
        callback: jest
          .fn()
          .mockResolvedValue({
            access_token: "access_token",
            id_token: "id_token",
          }),
        metadata: {
          client_id: "test_client_id",
          redirect_uris: ["http://localost:3000/test"],
        },
        issuer: { metadata: { token_endpoint: "http://localost:8000/token" } },
      },
    });
    req.oidc!.callback = jest.fn().mockRejectedValue(error);
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      "OAuth callback processing failed",
      {
        error: "Token exchange failed",
        stack: error.stack,
      },
    );
    expect(res.render).toHaveBeenCalledWith("500.njk");
  });

  it("should return 500 and handle non-Error exceptions", async () => {
    const error = "String error";
    buildAssertionJwt.mockRejectedValue(error);
    const req = getMockReq({
      oidc: {
        callbackParams: jest.fn(),
        callback: jest
          .fn()
          .mockResolvedValue({
            access_token: "access_token",
            id_token: "id_token",
          }),
        metadata: {
          client_id: "test_client_id",
          redirect_uris: ["http://localost:3000/test"],
        },
        issuer: { metadata: { token_endpoint: "http://localost:8000/token" } },
      },
    });
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      "OAuth callback processing failed",
      {
        error: "String error",
        stack: undefined,
      },
    );
    expect(res.render).toHaveBeenCalledWith("500.njk");
  });

  it("should return 200 and redirect to /select-document", async () => {
    const callback = { access_token: "access_token", id_token: "id_token" };
    const req = getMockReq({
      oidc: {
        callbackParams: jest.fn(),
        callback: jest.fn().mockImplementation(() => callback),
        metadata: {
          client_id: "test_client_id",
          redirect_uris: ["http://localost:3000/test"],
        },
        issuer: { metadata: { token_endpoint: "http://localost:8000/token" } },
      },
    });
    const { res } = getMockRes();
    buildAssertionJwt.mockImplementationOnce(() => "clientAssertionJWT");

    await returnFromAuthGetController(req, res);

    expect(res.cookie).toHaveBeenNthCalledWith(
      1,
      "access_token",
      "access_token",
      { httpOnly: true, maxAge: 100000 },
    );
    expect(res.cookie).toHaveBeenNthCalledWith(2, "id_token", "id_token", {
      httpOnly: true,
      maxAge: 100000,
    });
    expect(res.redirect).toHaveBeenCalledWith("/select-document");
  });
});
