import { issuerStartGetController } from "../../src/issuerStart/controller";
import { Request, Response } from "express";

describe("issuerStartGetController", () => {
  it("should render the start page", () => {
    const req = {} as Request;
    const res = { render: jest.fn() } as unknown as Response;

    issuerStartGetController(req, res);

    expect(res.render).toHaveBeenCalledWith("start-now.njk");
  });
});
