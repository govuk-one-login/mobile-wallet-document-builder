import {
  AppSelectorConfig,
  appSelectorGetController,
  appSelectorPostController,
} from "../../src/appSelector/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("controller.ts", () => {
  let config: AppSelectorConfig;

  beforeEach(async () => {
    config = {
      environment: "test",
      cookieExpiry: 100000,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form for selecting an app when user is not authenticated (no id_token in cookies)", async () => {
    const req = getMockReq({ cookies: {} });
    const { res } = getMockRes();

    await appSelectorGetController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
      authenticated: false,
      apps: expect.any(Array),
    });
  });

  it("should render the form for selecting an app when user is authenticated", async () => {
    const req = getMockReq({
      cookies: {
        id_token: "id_token",
      },
    });
    const { res } = getMockRes();

    await appSelectorGetController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
      authenticated: true,
      apps: expect.any(Array),
    });
  });

  it("should redirect to the page for selecting a document", async () => {
    const req = getMockReq({
      body: {
        "select-app-choice": "govuk-build",
      },
    });
    const { res } = getMockRes();

    await appSelectorPostController(config)(req, res);

    expect(res.cookie).toHaveBeenCalledWith("app", "govuk-build", {
      httpOnly: true,
      maxAge: 100000,
    });
    expect(res.redirect).toHaveBeenCalledWith("/select-vc-data-model");
  });

  it("should re-render the form for selecting an app when no choice was selected", async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    await appSelectorPostController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
      isInvalid: true,
      authenticated: false,
      apps: expect.any(Array),
    });
    expect(res.redirect).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it("should call render function with staging apps only when environment is staging", async () => {
    const req = getMockReq({ cookies: {} });
    const { res } = getMockRes();
    const config: AppSelectorConfig = {
      environment: "build",
    };

    await appSelectorGetController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
      authenticated: false,
      apps: [
        {
          text: "GOV.UK App (Build)",
          value: "govuk-build",
        },
        {
          text: "Wallet Test App (Dev)",
          value: "wallet-test-dev",
        },
        {
          text: "Wallet Test App (Build)",
          value: "wallet-test-build",
        },
      ],
    });
  });

  it("should call render function with non-staging apps only when environment is NOT staging", async () => {
    const req = getMockReq({ cookies: {} });
    const { res } = getMockRes();
    const config: AppSelectorConfig = {
      environment: "staging",
    };

    await appSelectorGetController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
      authenticated: false,
      apps: [
        {
          text: "GOV.UK App (Staging)",
          value: "govuk-staging",
        },
        {
          text: "Wallet Test App (Staging)",
          value: "wallet-test-staging",
        },
      ],
    });
  });
});
