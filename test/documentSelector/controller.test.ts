import {
  documentSelectorGetController,
  documentSelectorPostController,
} from "../../src/documentSelector/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("documentSelectorGetController", () => {
  it.each([
    ["/build-nino-document", "SocialSecurityCredential"],
    ["/build-dbs-document", "BasicDisclosureCredential"],
    ["/build-veteran-card-document", "DigitalVeteranCard"],
    ["/build-mdl-document", "org.iso.18013.5.1.mDL"],
  ])(
    "redirects to %s when credentialType=%s",
    (expectedRoute, credentialType) => {
      const req = getMockReq({ query: { credentialType } });
      const { res } = getMockRes();

      documentSelectorGetController(req, res);

      expect(res.redirect).toHaveBeenCalledWith(expectedRoute);
    },
  );

  it("should render select-document form when there is no credentialType query param", () => {
    const req = getMockReq({ query: {} });
    const { res } = getMockRes();

    documentSelectorGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {
      authenticated: false,
      documentOptions: [
        {
          text: "NINO",
          value: "SocialSecurityCredential",
        },
        {
          text: "DBS",
          value: "BasicDisclosureCredential",
        },
        {
          text: "Veteran Card",
          value: "DigitalVeteranCard",
        },
        {
          text: "Driving Licence",
          value: "org.iso.18013.5.1.mDL",
        },
      ],
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it("should render select-document form when credentialType query param is invalid", () => {
    const req = getMockReq({
      query: { credentialType: "InvalidCredentialType" },
    });
    const { res } = getMockRes();

    documentSelectorGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {
      authenticated: false,
      documentOptions: [
        {
          text: "NINO",
          value: "SocialSecurityCredential",
        },
        {
          text: "DBS",
          value: "BasicDisclosureCredential",
        },
        {
          text: "Veteran Card",
          value: "DigitalVeteranCard",
        },
        {
          text: "Driving Licence",
          value: "org.iso.18013.5.1.mDL",
        },
      ],
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });
});

describe("documentSelectorPostController", () => {
  it.each([
    ["/build-nino-document", "SocialSecurityCredential"],
    ["/build-dbs-document", "BasicDisclosureCredential"],
    ["/build-veteran-card-document", "DigitalVeteranCard"],
    ["/build-mdl-document", "org.iso.18013.5.1.mDL"],
  ])("should redirect to %s when selection=%s", (expectedRoute, selection) => {
    const req = getMockReq({
      body: {
        "select-document-choice": selection,
      },
    });
    const { res } = getMockRes();

    documentSelectorPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith(expectedRoute);
  });

  it("should re-render select-document form with a validation error when document selected is invalid", () => {
    const req = getMockReq({
      body: {
        "select-document-choice": "InvalidCredentialType",
      },
    });
    const { res } = getMockRes();

    documentSelectorPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {
      error: true,
      authenticated: false,
      documentOptions: [
        {
          text: "NINO",
          value: "SocialSecurityCredential",
        },
        {
          text: "DBS",
          value: "BasicDisclosureCredential",
        },
        {
          text: "Veteran Card",
          value: "DigitalVeteranCard",
        },
        {
          text: "Driving Licence",
          value: "org.iso.18013.5.1.mDL",
        },
      ],
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it("should re-render select-document form with a validation error when no document selected", () => {
    const req = getMockReq({ body: {} });
    const { res } = getMockRes();

    documentSelectorPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {
      error: true,
      authenticated: false,
      documentOptions: [
        {
          text: "NINO",
          value: "SocialSecurityCredential",
        },
        {
          text: "DBS",
          value: "BasicDisclosureCredential",
        },
        {
          text: "Veteran Card",
          value: "DigitalVeteranCard",
        },
        {
          text: "Driving Licence",
          value: "org.iso.18013.5.1.mDL",
        },
      ],
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
