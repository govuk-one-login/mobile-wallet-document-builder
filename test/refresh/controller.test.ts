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
        cookies: { id_token: "id_token" },
        params: { credentialType: credentialType },
      });
      const { res } = getMockRes();
      await refreshGetController(req, res);
      expect(res.render).toHaveBeenCalledWith("refresh-form.njk", {
        authenticated: true,
        credentialType: "SocialSecurityCredential",
      });
    });

    it("should render the error page if an error happens trying to process request", async () => {
      const req = getMockReq({
        cookies: { id_token: "id_token" },
      });
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
      expect(res.render).toHaveBeenCalledWith("no-update.njk", {
        authenticated: true,
        credentialType: "SocialSecurityCredential",
      });
    });

    const cases: [CredentialType, string][] = [
      [
        CredentialType.SocialSecurityCredential,
        "nino-document-details-form.njk",
      ],
      [
        CredentialType.BasicDisclosureCredential,
        "dbs-document-details-form.njk",
      ],
      [
        CredentialType.DigitalVeteranCard,
        "veteran-card-document-details-form.njk",
      ],
      [CredentialType.MobileDrivingLicence, "mdl-document-details-form.njk"],
    ];

    it.each(cases)(
      "should render the correct template for %s when the refreshChoice is Yes",
      async (credentialType, expectedTemplate) => {
        const req = getMockReq({
          params: { credentialType },
          body: { refreshChoice: "Yes" },
          cookies: { id_token: "id_token" },
        });
        const { res } = getMockRes();

        await refreshPostController(req, res);
        expect(res.render).toHaveBeenCalledWith(expectedTemplate, {
          authenticated: true,
          credentialType,
        });
      },
    );

    it("should render the error page if an error happens trying to process refresh credential", async () => {
      const req = getMockReq({
        params: { credentialType: "Unknown" },
        body: { refreshChoice: "Yes" },
        cookies: { id_token: "id_token" },
      });
      const { res } = getMockRes();
      (res.render as jest.Mock).mockImplementationOnce(() => {
        throw new Error("error");
      });
      await refreshPostController(req, res);
      expect(res.render).toHaveBeenCalledWith("500.njk");
    });
  });
});
