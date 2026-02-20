import * as proofJwt from "../../src/proofJwt/proofJwt";
import * as signingKey from "../../src/config/appConfig";
import { proofJwtController } from "../../src/proofJwt/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("controller.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return 200 and proofJwt when successful", async () => {
    const mockSignedJwt = "signed jwt token";

    jest
      .spyOn(signingKey, "getStsSigningKeyId")
      .mockReturnValue("mock_signing_key_id");
    jest.spyOn(proofJwt, "getProofJwt").mockResolvedValue(mockSignedJwt);

    const req = getMockReq({
      query: {
        nonce: "test-nonce",
        audience: "test-audience",
      },
    });

    const { res } = getMockRes();

    await proofJwtController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ proofJwt: mockSignedJwt });
  });

  it("should return 500 and server_error when signing fails", async () => {
    jest
      .spyOn(signingKey, "getStsSigningKeyId")
      .mockReturnValue("mock_signing_key_id");

    jest
      .spyOn(proofJwt, "getProofJwt")
      .mockRejectedValue(new Error("Signing failed"));

    const req = getMockReq({
      query: {
        nonce: "test-nonce",
        audience: "test-audience",
      },
    });

    const { res } = getMockRes();

    await proofJwtController(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "server_error" });
  });
});
