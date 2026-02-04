import { NextFunction } from "express";
import { requiresAppSelected } from "../../src/middleware/requiresAppSelected";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("requiresAppSelected", () => {
  it("should redirect to /select-app if app cookie is missing", () => {
    const req = getMockReq({
      cookies: {},
    });
    const { res } = getMockRes();
    const nextFunction: NextFunction = jest.fn();

    requiresAppSelected(req, res, nextFunction);

    expect(res.redirect).toHaveBeenCalledWith(
      "http://localhost:3000/select-app",
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should call next when app cookie is present", () => {
    const req = getMockReq({
      cookies: {
        app: "test-app",
      },
    });
    const { res } = getMockRes();
    const nextFunction: NextFunction = jest.fn();

    requiresAppSelected(req, res, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
