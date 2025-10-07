import {
  revokeGetController,
  revokePostController,
} from "../../src/revoke/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { revokeCredentials } from "../../src/revoke/services/revokeService";

jest.mock("../../src/revoke/services/revokeService", () => ({
  revokeCredentials: jest.fn(),
}));

describe("revoke", () => {
  describe("revokeGetController", () => {
    const req = getMockReq();
    const { res } = getMockRes();

    it("should render the revoke form", () => {
      revokeGetController(req, res);

      expect(res.render).toHaveBeenCalledWith("revoke-form.njk");
    });
  });

  describe("revokePostController", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
    });

    const req = getMockReq({
      body: {
        "driving-licence-number": "EDWAR210513SE5RO",
      },
    });
    const { res } = getMockRes();

    it("should render success message when revocation succeeds", async () => {
      const mockResult = {
        message: "Credential successfully revoked",
        messageType: "success" as const,
      };
      (revokeCredentials as jest.Mock).mockResolvedValue(mockResult);

      await revokePostController(req, res);

      expect(revokeCredentials).toHaveBeenCalledWith("EDWAR210513SE5RO");
      expect(res.render).toHaveBeenCalledWith("revoke-form.njk", {
        message: "Credential successfully revoked",
        messageType: "success",
      });
    });

    it("should render error message when revocation fails", async () => {
      const mockResult = {
        message: "No credential found for this driving licence number",
        messageType: "error" as const,
      };
      (revokeCredentials as jest.Mock).mockResolvedValue(mockResult);

      await revokePostController(req, res);

      expect(revokeCredentials).toHaveBeenCalledWith("EDWAR210513SE5RO");
      expect(res.render).toHaveBeenCalledWith("revoke-form.njk", {
        message: "No credential found for this driving licence number",
        messageType: "error",
      });
    });

    it("should render 500 page if an unexpected error occurs", async () => {
      (revokeCredentials as jest.Mock).mockRejectedValue(
        new Error("Unexpected error"),
      );

      await revokePostController(req, res);

      expect(res.render).toHaveBeenCalledWith("500.njk");
    });
  });
});
