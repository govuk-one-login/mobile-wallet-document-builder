import {
  RevokeConfig,
  revokeGetController,
  revokePostController,
} from "../../src/revoke/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { revokeCredentials } from "../../src/revoke/services/revokeService";

jest.mock("../../src/revoke/services/revokeService", () => ({
  revokeCredentials: jest.fn(),
}));

const CRI_URL = "https://test-cri.example.com";
const DOCUMENT_ID = "ABC123def567";

describe("revoke", () => {
  let config: RevokeConfig;

  beforeEach(async () => {
    config = {
      criUrl: CRI_URL,
    };
  });

  describe("revokeGetController", () => {
    const req = getMockReq();
    const { res } = getMockRes();

    it("should render the revoke form", () => {
      revokeGetController()(req, res);

      expect(res.render).toHaveBeenCalledWith("revoke-form.njk");
    });
  });

  describe("revokePostController", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
    });

    const req = getMockReq({
      body: {
        documentId: DOCUMENT_ID,
      },
    });
    const { res } = getMockRes();

    it.each([
      "shrt", // 4 characters but minimum is 5
      "documentIdIsTooLong1234567", // 26 characters but maximum is 25
      "spaces are not ok",
      "invalidChars@!",
    ])(
      "should render an error when the document ID is invalid ('%s')",
      async (invalidId) => {
        const req = getMockReq({
          body: {
            documentId: invalidId,
          },
        });

        await revokePostController(config)(req, res);

        expect(revokeCredentials).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith("revoke-form.njk", {
          error:
            "ID must be 5 to 25 characters long and contain only uppercase or lowercase letters and digits",
          value: invalidId,
        });
      },
    );

    it("should render 500 error page if an unexpected error occurs", async () => {
      (revokeCredentials as jest.Mock).mockRejectedValue(
        new Error("Unexpected error"),
      );

      await revokePostController(config)(req, res);

      expect(res.render).toHaveBeenCalledWith("500.njk");
    });

    it("should render success message when revocation succeeds", async () => {
      const mockResult = {
        message: "Credential successfully revoked",
        messageType: "success" as const,
      };
      (revokeCredentials as jest.Mock).mockResolvedValue(mockResult);

      await revokePostController(config)(req, res);

      expect(revokeCredentials).toHaveBeenCalledWith(CRI_URL, DOCUMENT_ID);
      expect(res.render).toHaveBeenCalledWith("revoke-form.njk", {
        message: "Credential successfully revoked",
        messageType: "success",
      });
    });

    it("should render error message when revocation fails", async () => {
      const mockResult = {
        message: "No credential found for this document identifier",
        messageType: "error" as const,
      };
      (revokeCredentials as jest.Mock).mockResolvedValue(mockResult);

      await revokePostController(config)(req, res);

      expect(revokeCredentials).toHaveBeenCalledWith(CRI_URL, DOCUMENT_ID);
      expect(res.render).toHaveBeenCalledWith("revoke-form.njk", {
        message: "No credential found for this document identifier",
        messageType: "error",
      });
    });
  });
});
