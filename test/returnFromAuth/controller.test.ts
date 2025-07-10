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

  // Helper function to create a OIDC mock request
  const createOidcMockReq = (overrides = {}) => {
    return getMockReq({
      cookies: { nonce: "test_nonce", state: "test_state" },
      oidc: {
        callbackParams: jest.fn().mockReturnValue({ code: "auth_code_123" }),
        callback: jest.fn().mockResolvedValue({
          access_token: "access_token",
          id_token: "id_token",
        }),
        metadata: {
          client_id: "test_client_id",
          redirect_uris: ["http://localhost:3000/test"],
        },
        issuer: {
          metadata: {
            token_endpoint: "http://localhost:8000/token",
          },
        },
      },
      ...overrides,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    loggerErrorSpy.mockReset();
    buildAssertionJwt.mockResolvedValue("clientAssertionJWT");
  });

  it("should return 500 on OAuth error in query parameters", async () => {
    const req = getMockReq({
      query: {
        error: "access_denied",
        error_description: "User denied access",
      },
    });
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    expect(loggerErrorSpy).toHaveBeenCalledWith("OAuth authorization failed", {
      error: "access_denied",
      error_description: "User denied access",
    });
    expect(res.render).toHaveBeenCalledWith("500.njk");
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it("should handle OAuth error without description", async () => {
    const req = getMockReq({
      query: { error: "server_error" },
    });
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    expect(loggerErrorSpy).toHaveBeenCalledWith("OAuth authorization failed", {
      error: "server_error",
      error_description: undefined,
    });
    expect(res.render).toHaveBeenCalledWith("500.njk");
  });

  it("should return 500 on client assertion building failure", async () => {
    const error = new Error("JWT signing failed");
    buildAssertionJwt.mockRejectedValue(error);
    const req = createOidcMockReq();
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      "OAuth callback processing failed",
      {
        error: "JWT signing failed",
        stack: error.stack,
      },
    );
    expect(res.render).toHaveBeenCalledWith("500.njk");
  });

  it("should return 500 on OIDC callback failure", async () => {
    const error = new Error("Token exchange failed");
    const req = createOidcMockReq();
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

  it("should handle non-Error exceptions", async () => {
    const error = "String error";
    buildAssertionJwt.mockRejectedValue(error);
    const req = createOidcMockReq();
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

  it("should successfully process OAuth callback and redirect", async () => {
    const req = createOidcMockReq();
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    // Verify client assertion was called correctly
    expect(buildAssertionJwt).toHaveBeenCalledWith(
      "test_client_id",
      "http://localhost:8000/token",
      "14122ec4-cdd0-4154-8275-04363c15fbd9",
    );

    // Verify OIDC callback was called with correct parameters
    expect(req.oidc!.callback).toHaveBeenCalledWith(
      "http://localhost:3000/test",
      { code: "auth_code_123" },
      { nonce: "test_nonce", state: "test_state" },
      {
        exchangeBody: {
          client_assertion_type:
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          client_assertion: "clientAssertionJWT",
        },
      },
    );

    // Verify cookies were set with correct options
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

    // Verify redirect
    expect(res.redirect).toHaveBeenCalledWith("/select-document");
    expect(loggerErrorSpy).not.toHaveBeenCalled();
  });
});
