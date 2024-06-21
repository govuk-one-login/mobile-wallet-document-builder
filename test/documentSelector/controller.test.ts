import {
  documentSelectorGetController,
  documentSelectorPostController,
} from "../../src/documentSelector/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form for selecting a document when user is not authenticated (no id_token in cookies)", async () => {
    const req = getMockReq({cookies: {}});
    const { res } = getMockRes();

    await documentSelectorGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {"authenticated": false});
  });

  it("should render the form for selecting a document when user is authenticated", async () => {
    const req = getMockReq({cookies: {id_token: "id_token"}});
    const { res } = getMockRes();

    await documentSelectorGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {"authenticated": true});
  });

  it("should redirect to the DBS document form page when DBS is selected", async () => {
    const req = getMockReq({
      body: {
        "select-document-choice": "dbs",
      },
    });
    const { res } = getMockRes();

    await documentSelectorPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/build-dbs-document");
  });

  it("should redirect to the NINO document form page when NINO is selected", async () => {
    const req = getMockReq({
      body: {
        "select-document-choice": "nino",
      },
    });
    const { res } = getMockRes();

    await documentSelectorPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/build-nino-document");
  });

  it("should re-render the form for selecting a document when no choice was selected", async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    await documentSelectorPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {
      authenticated: false,
      isInvalid: true,
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
