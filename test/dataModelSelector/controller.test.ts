import {
  DataModelSelectorConfig,
  dataModelSelectorGetController,
  dataModelSelectorPostController,
} from "../../src/dataModelSelector/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("controller.ts", () => {
  let config: DataModelSelectorConfig;

  beforeEach(async () => {
    config = {
      cookieExpiry: 100000,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form for selecting the vc data model", () => {
    const req = getMockReq({ cookies: {} });
    const { res } = getMockRes();

    dataModelSelectorGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-vc-data-model-form.njk", {
      authenticated: false,
    });
  });

  it("should redirect to the page for selecting a document", async () => {
    const req = getMockReq({
      body: {
        "select-vc-data-model-choice": "v1.1",
      },
    });
    const { res } = getMockRes();

    await dataModelSelectorPostController(config)(req, res);

    expect(res.cookie).toHaveBeenCalledWith("dataModel", "v1.1", {
      httpOnly: true,
      maxAge: 100000,
    });
    expect(res.redirect).toHaveBeenCalledWith("/select-document");
  });
});
