import { NextFunction } from "express";
import { requiresAuth } from "../../src/middleware/requiresAuth";
import { getMockReq, getMockRes } from "@jest-mock/express";

process.env.BASE_URL = "http://localhost:3000";
process.env.COOKIE_TTL_IN_SECS = "100";

describe("requiresAuth.ts", () => {
  it("should redirect to /select-app if app not in cookies", () => {
    const req = getMockReq({
      cookies: {},
    });
    const { res } = getMockRes();
    const nextFunction: NextFunction = jest.fn();

    requiresAuth(req, res, nextFunction);

    expect(res.redirect).toHaveBeenCalledWith(
      "http://localhost:3000/select-app"
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should not redirect to auth server to log in if selected app does not require logging in", () => {
    const req = getMockReq({
      cookies: {
        app: "govuk-build",
      },
    });
    const { res } = getMockRes();
    const nextFunction: NextFunction = jest.fn();

    requiresAuth(req, res, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it("should redirect to auth server to log in if user is not authenticated", () => {
    const req = getMockReq({
      cookies: {
        app: "govuk-staging",
        isAuthenticated: undefined,
      },
      oidc: {
        authorizationUrl: jest.fn(),
        metadata: {
          scopes: "openid",
          redirect_uris: ["url"],
          client_id: "test-client",
        },
      },
      /* eslint-disable  @typescript-eslint/no-explicit-any */
    }) as any;

    const { res } = getMockRes();
    const nextFunction: NextFunction = jest.fn();

    requiresAuth(req, res, nextFunction);

    expect(req.oidc.authorizationUrl).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalled();
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
