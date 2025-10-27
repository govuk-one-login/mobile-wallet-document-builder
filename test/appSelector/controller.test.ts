import {
  AppSelectorConfig,
  appSelectorGetController,
  appSelectorPostController,
} from "../../src/appSelector/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("appSelectorGetController", () => {
  it("should render select-app form with staging options when environment=staging", () => {
    const config = {
      environment: "staging",
      cookieExpiry: 100000,
    };
    const req = getMockReq();
    const { res } = getMockRes();

    appSelectorGetController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
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
      authenticated: false,
      credentialType: undefined,
    });
  });

  it("should render select-app form with non-staging options when environment=build", () => {
    const config = {
      environment: "build",
      cookieExpiry: 100000,
    };
    const req = getMockReq();
    const { res } = getMockRes();

    appSelectorGetController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
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
      authenticated: false,
      credentialType: undefined,
    });
  });
});

describe("appSelectorPostController", () => {
  let config: AppSelectorConfig;

  beforeEach(() => {
    config = {
      environment: "test",
      cookieExpiry: 100000,
    };
  });

  it("should re-render select-app form with a validation error when no app is selected", () => {
    const req = getMockReq();
    const { res } = getMockRes();

    appSelectorPostController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
      error: true,
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
      authenticated: false,
      credentialType: undefined,
    });
    expect(res.redirect).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it("should re-render select-app form with a validation error when app selected is invalid", () => {
    const req = getMockReq({
      body: {
        "select-app-choice": "not-a-valid-app-option",
      },
    });
    const { res } = getMockRes();

    appSelectorPostController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-app-form.njk", {
      error: true,
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
      authenticated: false,
      credentialType: undefined,
    });
    expect(res.redirect).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it("should set the app cookie to the selected value with the configured expiry", () => {
    const req = getMockReq({
      body: {
        "select-app-choice": "govuk-build",
      },
    });
    const { res } = getMockRes();

    appSelectorPostController(config)(req, res);

    expect(res.cookie).toHaveBeenCalledWith("app", "govuk-build", {
      httpOnly: true,
      maxAge: 100000,
    });
  });

  it("should redirect to /select-document with credentialType when provided", () => {
    const req = getMockReq({
      body: {
        "select-app-choice": "govuk-build",
        credentialType: "SocialSecurityCredential",
      },
    });
    const { res } = getMockRes();

    appSelectorPostController(config)(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      "/select-document?credentialType=SocialSecurityCredential",
    );
  });

  it("should redirect to /select-document without credentialType when not provided", () => {
    const req = getMockReq({
      body: {
        "select-app-choice": "govuk-build",
      },
    });
    const { res } = getMockRes();

    appSelectorPostController(config)(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/select-document");
  });
});
