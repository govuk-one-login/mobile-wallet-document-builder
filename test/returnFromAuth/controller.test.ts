import { getMockReq, getMockRes } from "@jest-mock/express";
import { returnFromAuthGetController } from "../../src/returnFromAuth/controller";
import { logger } from "../../src/middleware/logger";

process.env.COOKIE_TTL_IN_SECS = "100";

describe("controller.ts", () => {
  const loggerErrorSpy = jest
    .spyOn(logger, "error")
    .mockImplementation(() => undefined);

  beforeEach(() => {
    loggerErrorSpy.mockReset();
  });

  it("should return 500 when the auth server responds with an error", async () => {
    const req = getMockReq({
      query: { error: "access_denied", error_description: "some description" },
    });
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    expect(loggerErrorSpy).toHaveBeenNthCalledWith(
      1,
      "access_denied - some description"
    );
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 500 when the token response does not have an access token", async () => {
    const callback = { id_token: "id_token" };
    const req = getMockReq({
      oidc: {
        callbackParams: jest.fn(),
        callback: jest.fn().mockImplementation(() => callback),
        metadata: { redirect_uris: ["http://localost:3000/test"] },
      },
    });
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    expect(loggerErrorSpy).toHaveBeenNthCalledWith(
      1,
      "No access token received"
    );
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 500 when the token response does not have an id token", async () => {
    const callback = { access_token: "access_token" };
    const req = getMockReq({
      oidc: {
        callbackParams: jest.fn(),
        callback: jest.fn().mockImplementation(() => callback),
        metadata: { redirect_uris: ["http://localost:3000/test"] },
      },
    });
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, "No id token received");
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 200 and redirect to /select-document", async () => {
    const callback = { access_token: "access_token", id_token: "id_token" };
    const req = getMockReq({
      oidc: {
        callbackParams: jest.fn(),
        callback: jest.fn().mockImplementation(() => callback),
        metadata: { redirect_uris: ["http://localost:3000/test"] },
      },
    });
    const { res } = getMockRes();

    await returnFromAuthGetController(req, res);

    expect(res.cookie).toHaveBeenNthCalledWith(
      1,
      "access_token",
      "access_token",
      { httpOnly: true, maxAge: 100000 }
    );
    expect(res.cookie).toHaveBeenNthCalledWith(2, "id_token", "id_token", {
      httpOnly: true,
      maxAge: 100000,
    });
    expect(res.redirect).toHaveBeenCalledWith("/select-document");
  });
});
