import {
  documentSelectorGetController,
  documentSelectorPostController,
} from "../../src/documentSelector/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form for selecting a document", async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    await documentSelectorGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk");

  });

  it("should redirect to the DBS document form page when DBS is selected", async () => {
    const req = getMockReq({
      body: {
        "select-document-choice": "dbs",
      }
    });
    const { res } = getMockRes();

    await documentSelectorPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      "/build-dbs-document"
    );
  });

  it("should redirect to the NINO document form page when NINO is selected", async () => {
    const req = getMockReq({
      body: {
        "select-document-choice": "nino",
      }
    });
    const { res } = getMockRes();

    await documentSelectorPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      "/build-nino-document"
    );
  });

  it("should re-render the form for selecting a document when no choice was selected", async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    await documentSelectorPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-document-form.njk", {
      isInvalid: true,
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
