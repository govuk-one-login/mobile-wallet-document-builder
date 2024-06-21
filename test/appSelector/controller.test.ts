import {
  appSelectorGetController,
  appSelectorPostController,
} from "../../src/appSelector/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

process.env.COOKIE_TTL_IN_SECS = "100";

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form for selecting an app", async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    await appSelectorGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk");
  });

  it("should redirect to the page for selecting a document", async () => {
    const req = getMockReq({
      body: {
        "select-app-choice": "govuk-build",
      },
    });
    const { res } = getMockRes();

    await appSelectorPostController(req, res);

    expect(res.cookie).toHaveBeenCalledWith("app", "govuk-build", {
      httpOnly: true,
      maxAge: 100000,
    });
    expect(res.redirect).toHaveBeenCalledWith("/select-document");
  });

  it("should re-render the form for selecting an app when no choice was selected", async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    await appSelectorPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
      isInvalid: true,
    });
    expect(res.redirect).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });
});
