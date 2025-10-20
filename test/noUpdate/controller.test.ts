import { getMockReq, getMockRes } from "@jest-mock/express";
import { noUpdateGetController } from "../../src/noUpdate/controller";

describe("noUpdate", () => {
  describe("noUpdateGetController()", () => {
    it("should render the no update page", async () => {
      const req = getMockReq();
      const { res } = getMockRes();
      await noUpdateGetController(req, res);
      expect(res.render).toHaveBeenCalledWith("no-update.njk");
    });
  });
});
