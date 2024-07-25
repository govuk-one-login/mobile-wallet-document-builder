import { credentialOfferViewerController } from "../../src/credentialOfferViewer/controller";
import * as credentialOfferService from "../../src/credentialOfferViewer/services/credentialOfferService";
import * as customCredentialOfferUri from "../../src/credentialOfferViewer/helpers/customCredentialOfferUri";
import QRCode from "qrcode";
import { getMockReq, getMockRes } from "@jest-mock/express";

export const WALLET_SUBJECT_ID: string =
  "urn:fdc:wallet.account.gov.uk:2024:DtPT8x-dp_73tnlY3KNTiCitziN9GEherD16bqxNt9i";

jest.mock(
  "../../src/credentialOfferViewer/services/credentialOfferService",
  () => ({
    getCredentialOffer: jest.fn(),
  })
);
jest.mock(
  "../../src/credentialOfferViewer/helpers/customCredentialOfferUri",
  () => ({
    getCustomCredentialOfferUri: jest.fn(),
  })
);
jest.mock("qrcode");

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const getCredentialOffer =
    credentialOfferService.getCredentialOffer as jest.Mock;
  const getCustomCredentialOfferUri =
    customCredentialOfferUri.getCustomCredentialOfferUri as jest.Mock;
  const mockedQrCode = QRCode as jest.Mocked<typeof QRCode>;

  it("should render the credential offer page and not call the user info endpoint when app selected is not staging app", async () => {
    const userinfo = { wallet_subject_id: WALLET_SUBJECT_ID };
    const req = getMockReq({
      params: {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      },
      cookies: {
        app: "test-build",
        id_token: "id_token",
        access_token: "access_token",
      },
      query: {
        type: "BasicCheckCredential",
        error: "",
      },
      oidc: {
        userinfo: jest.fn().mockImplementation(() => userinfo),
      },
    });
    const { res } = getMockRes();

    const credentialOfferMocked = {
      credential_offer_uri:
        "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer",
    };
    const qrCodeMocked =
      "data:image/png;base64,iVBORw0KGgoAAAANSU" as unknown as void;
    mockedQrCode.toDataURL.mockReturnValueOnce(qrCodeMocked);
    getCredentialOffer.mockReturnValueOnce(credentialOfferMocked);
    getCustomCredentialOfferUri.mockReturnValueOnce(
      "https://mobile.build.account.gov.uk/test-wallet/add?credential_offer=testCredentialOffer"
    );

    await credentialOfferViewerController(req, res);

    expect(req.oidc.userinfo).not.toHaveBeenCalled();
    expect(getCredentialOffer).toHaveBeenCalledWith(
      WALLET_SUBJECT_ID,
      "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      "BasicCheckCredential"
    );
    expect(getCustomCredentialOfferUri).toHaveBeenCalledWith(
      "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer",
      "test-build",
      ""
    );
    expect(res.render).toHaveBeenCalledWith("credential-offer.njk", {
      authenticated: true,
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSU",
      universalLink:
        "https://mobile.build.account.gov.uk/test-wallet/add?credential_offer=testCredentialOffer",
    });
  });

  it("should render the credential offer page and call the user info endpoint when app selected is staging app", async () => {
    const userinfo = { wallet_subject_id: WALLET_SUBJECT_ID };
    const req = getMockReq({
      params: {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      },
      cookies: {
        app: "some-staging-app",
        id_token: "id_token",
        access_token: "access_token",
      },
      query: {
        type: "BasicCheckCredential",
        error: "",
      },
      oidc: {
        userinfo: jest.fn().mockImplementation(() => userinfo),
      },
    });
    const { res } = getMockRes();

    const credentialOfferMocked = {
      credential_offer_uri:
        "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer",
    };
    const qrCodeMocked =
      "data:image/png;base64,iVBORw0KGgoAAAANSU" as unknown as void;
    mockedQrCode.toDataURL.mockReturnValueOnce(qrCodeMocked);
    getCredentialOffer.mockReturnValueOnce(credentialOfferMocked);
    getCustomCredentialOfferUri.mockReturnValueOnce(
      "https://mobile.build.account.gov.uk/test-wallet/add?credential_offer=testCredentialOffer"
    );

    await credentialOfferViewerController(req, res);

    expect(req.oidc.userinfo).toHaveBeenCalled();
    expect(getCredentialOffer).toHaveBeenCalledWith(
      WALLET_SUBJECT_ID,
      "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      "BasicCheckCredential"
    );
    expect(getCustomCredentialOfferUri).toHaveBeenCalledWith(
      "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer",
      "some-staging-app",
      ""
    );
    expect(res.render).toHaveBeenCalledWith("credential-offer.njk", {
      authenticated: true,
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSU",
      universalLink:
        "https://mobile.build.account.gov.uk/test-wallet/add?credential_offer=testCredentialOffer",
    });
  });

  it("should render an error page when an error happens", async () => {
    const req = getMockReq({
      params: {
        documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      },
      cookies: {
        app: "test-build",
      },
      query: {
        type: "BasicCheckCredential",
        error: "ERROR:500",
      },
    });
    const { res } = getMockRes();
    getCredentialOffer.mockRejectedValueOnce(new Error("SOME_ERROR"));

    await credentialOfferViewerController(req, res);

    expect(res.render).toHaveBeenCalledWith("500.njk");
  });
});
