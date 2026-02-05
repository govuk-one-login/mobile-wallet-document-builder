import { NextFunction } from "express";
import { requiresAuth } from "../../src/middleware/requiresAuth";
import { getMockReq, getMockRes } from "@jest-mock/express";

process.env.SELF = "http://localhost:3000";
process.env.COOKIE_TTL_IN_MILLISECONDS = "100";

describe("requiresAuth", () => {
  it("should redirect to authorisation URL and set cookies when user is not authenticated", () => {
    const authorizationUrl = "https://auth.test/authorize";
    const req = getMockReq({
      url: "/test-protected",
      cookies: {
        app: "govuk-staging",
        // missing id_token => not authenticated
      },
      oidc: {
        authorizationUrl: jest.fn().mockReturnValue(authorizationUrl),
        metadata: {
          scopes: "openid",
          redirect_uris: ["http://localhost/callback"],
          client_id: "test-client",
        },
      },
      /* eslint-disable  @typescript-eslint/no-explicit-any */
    }) as any;
    const { res } = getMockRes();
    const nextFunction: NextFunction = jest.fn();

    requiresAuth(req, res, nextFunction);

    expect(req.oidc.authorizationUrl).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith(authorizationUrl);
    expect(res.cookie).toHaveBeenCalledWith(
      "nonce",
      expect.any(String),
      expect.objectContaining({ httpOnly: true, maxAge: 100 }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "state",
      expect.any(String),
      expect.objectContaining({ httpOnly: true, maxAge: 100 }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "current_url",
      "/test-protected",
      expect.objectContaining({ httpOnly: true, maxAge: 100 }),
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should call next when user is authenticated and app cookie is present", () => {
    const req = getMockReq({
      cookies: {
        app: "govuk-staging",
        id_token: "some-id-token",
      },
    });
    const { res } = getMockRes();
    const nextFunction: NextFunction = jest.fn();

    requiresAuth(req, res, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
