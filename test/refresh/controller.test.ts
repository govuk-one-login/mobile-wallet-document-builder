import { getMockReq, getMockRes } from "@jest-mock/express";
import {
  refreshGetController,
  refreshPostController,
} from "../../src/refresh/controller";
import { CredentialType } from "../../src/types/CredentialType";

describe("refresh", () => {
  describe("refreshGetController()", () => {
    const credentialType = "SocialSecurityCredential";

    it("should render the refresh form with authenticated user and credentialType", async () => {
      const req = getMockReq({
        params: { credentialType: credentialType },
      });
      const { res } = getMockRes();
      await refreshGetController(req, res);
      expect(res.render).toHaveBeenCalledWith("refresh-form.njk", {
        credentialType: "SocialSecurityCredential",
      });
    });

    it("should render the error page if an error happens trying to process request", async () => {
      const req = getMockReq();
      const { res } = getMockRes();
      (res.render as jest.Mock).mockImplementationOnce(() => {
        throw new Error("error");
      });
      await refreshGetController(req, res);
      expect(res.render).toHaveBeenCalledWith("500.njk");
    });
  });

  describe("refreshPostController()", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
    });

    it("should render the 'No update' page when the refreshChoice is No", async () => {
      const req = getMockReq({
        params: { credentialType: "SocialSecurityCredential" },
        body: { refreshChoice: "No" },
        cookies: { id_token: "id_token" },
      });
      const { res } = getMockRes();

      await refreshPostController(req, res);
      expect(res.redirect).toHaveBeenCalledWith("/no-update");
    });

    const validCredentialType = [
      CredentialType.SocialSecurityCredential,
      CredentialType.BasicDisclosureCredential,
      CredentialType.DigitalVeteranCard,
      CredentialType.MobileDrivingLicence,
    ];

    it.each(validCredentialType)(
      "should redirects to /select-app/? %s when the refreshChoice is Yes",
      async (credentialType) => {
        const req = getMockReq({
          params: { credentialType },
          body: { refreshChoice: "Yes" },
        });
        const { res } = getMockRes();

        await refreshPostController(req, res);
        expect(res.redirect).toHaveBeenCalledWith(`/select-app/?credentialType=${credentialType}`);
      },
    );

    it("should render the error page if an error happens trying to process refresh credential", async () => {
      const req = getMockReq({
        params: { credentialType: "Unknown Type" },
        body: { refreshChoice: "Yes" },
      });
      const { res } = getMockRes();
      await refreshPostController(req, res);
      expect(res.render).toHaveBeenCalledWith("500.njk");
    });
  });
});
