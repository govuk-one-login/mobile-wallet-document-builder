import { getMockReq, getMockRes } from "@jest-mock/express";
import {
  dvsJourneySelectorGetController,
  dvsJourneySelectorPostController,
} from "../../src/dvsJourneySelector/controller";

describe("dvsJourneySelectorGetController", () => {
  it("should render the journey selector form with all journey options", () => {
    const req = getMockReq();
    const { res } = getMockRes();

    dvsJourneySelectorGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-journey-form.njk", {
      journeyOptions: [
        {
          text: "Issue a new test digital driving licence",
          value: "issue",
        },
        {
          text: "Revoke an issued test digital driving licence",
          value: "revoke",
        },
      ],
    });
  });
});

describe("dvsJourneySelectorPostController", () => {
  it("should redirect to /build-dvs-test-document when the selected journey is 'issue'", () => {
    const req = getMockReq({
      body: { selectedJourney: "issue" },
    });
    const { res } = getMockRes();

    dvsJourneySelectorPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/dvs/build-driving-licence");
  });

  it("should redirect to /revoke when the selected journey is 'revoke'", () => {
    const req = getMockReq({
      body: { selectedJourney: "revoke" },
    });
    const { res } = getMockRes();

    dvsJourneySelectorPostController(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/revoke");
  });

  it("should re-render the journey selector form with a validation error when the selected journey is invalid", () => {
    const req = getMockReq({
      body: { selectedJourney: "unknownValue" },
    });
    const { res } = getMockRes();

    dvsJourneySelectorPostController(req, res);

    expect(res.render).toHaveBeenCalledWith("select-journey-form.njk", {
      error: true,
      journeyOptions: [
        {
          text: "Issue a new test digital driving licence",
          value: "issue",
        },
        {
          text: "Revoke an issued test digital driving licence",
          value: "revoke",
        },
      ],
    });
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
