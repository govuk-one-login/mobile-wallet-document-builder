import {
  documentSelectorGetController,
  documentSelectorPostController,
} from "../../src/documentSelector/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

const config = {
  documentsConfig: {
    TestCredential1: {
      route: "/build-test-document-1",
      name: "Test Document 1",
    },
    TestCredential2: {
      route: "/build-test-document-2",
      name: "Test Document 2",
    },
    TestCredential3: {
      route: "/build-test-document-3",
      name: "Test Document 3",
    },
  },
};

describe("documentSelectorGetController", () => {
  it.each([
    ["/build-test-document-1", "TestCredential1"],
    ["/build-test-document-2", "TestCredential2"],
    ["/build-test-document-3", "TestCredential3"],
  ])(
    "redirects to %s when credentialType=%s",
    (expectedRoute, credentialType) => {
      const req = getMockReq({ query: { credentialType } });
      const { res } = getMockRes();

      documentSelectorGetController(config)(req, res);

      expect(res.redirect).toHaveBeenCalledWith(expectedRoute);
    },
  );

  it("should render select-document form when there is no credentialType query param", () => {
    const req = getMockReq({ query: {} });
    const { res } = getMockRes();

    documentSelectorGetController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {
      authenticated: false,
      documents: [
        {
          text: "Test Document 1",
          value: "TestCredential1",
        },
        {
          text: "Test Document 2",
          value: "TestCredential2",
        },
        {
          text: "Test Document 3",
          value: "TestCredential3",
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

    documentSelectorGetController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {
      authenticated: false,
      documents: [
        {
          text: "Test Document 1",
          value: "TestCredential1",
        },
        {
          text: "Test Document 2",
          value: "TestCredential2",
        },
        {
          text: "Test Document 3",
          value: "TestCredential3",
        },
      ],
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });
});

describe("documentSelectorPostController", () => {
  it.each([
    ["/build-test-document-1", "TestCredential1"],
    ["/build-test-document-2", "TestCredential2"],
    ["/build-test-document-3", "TestCredential3"],
  ])("should redirect to %s when selection=%s", (expectedRoute, selection) => {
    const req = getMockReq({
      body: {
        "select-document-choice": selection,
      },
    });
    const { res } = getMockRes();

    documentSelectorPostController(config)(req, res);

    expect(res.redirect).toHaveBeenCalledWith(expectedRoute);
  });

  it("should re-render select-document form with a validation error when document selected is invalid", () => {
    const req = getMockReq({
      body: {
        "select-document-choice": "InvalidCredentialType",
      },
    });
    const { res } = getMockRes();

    documentSelectorPostController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {
      error: true,
      authenticated: false,
      documents: [
        {
          text: "Test Document 1",
          value: "TestCredential1",
        },
        {
          text: "Test Document 2",
          value: "TestCredential2",
        },
        {
          text: "Test Document 3",
          value: "TestCredential3",
        },
      ],
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it("should re-render select-document form with a validation error when no document selected", () => {
    const req = getMockReq({ body: {} });
    const { res } = getMockRes();

    documentSelectorPostController(config)(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {
      error: true,
      authenticated: false,
      documents: [
        {
          text: "Test Document 1",
          value: "TestCredential1",
        },
        {
          text: "Test Document 2",
          value: "TestCredential2",
        },
        {
          text: "Test Document 3",
          value: "TestCredential3",
        },
      ],
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
