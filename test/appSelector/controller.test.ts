import {
  appSelectorGetController,
  appSelectorPostController,
} from "../../src/appSelector/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

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
        "select-app-choice": "any-app",
      },
    });
    const { res } = getMockRes();

    await appSelectorPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/select-document?app=any-app");
  });

  it("should re-render the form for selecting an app when no choice was selected", async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    await appSelectorPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
      isInvalid: true,
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
