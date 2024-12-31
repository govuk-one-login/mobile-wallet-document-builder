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

  it("should render the credential offer page", async () => {
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
        "https://mobile.test.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22SocialSecurityCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiI5YmM4Y2I2MDQxYzExZTdiYjU1YWYyNDQzNzM4NmU4MTY1MWRhMDlkOTQxN2NjMTgzNTQ3ZjQ1NTliMDk2OWUyIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJhdWQiOiJodHRwczovL3N0dWItY3JlZGVudGlhbC1pc3N1ZXIubW9iaWxlLmRldi5hY2NvdW50Lmdvdi51ayIsImNsaWVudElkIjoiVEVTVF9DTElFTlRfSUQiLCJpc3MiOiJodHRwczovL3dhbGxldC1jcmVkLWlzc3Vlci1kZHVuZm9yZC1leGFtcGxlLWNyZWRlbnRpYWwtaXNzdWVyLm1vYmlsZS5kZXYuYWNjb3VudC5nb3YudWsiLCJjcmVkZW50aWFsX2lkZW50aWZpZXJzIjpbImEyZmNkYzdlLTgxZWYtNDYxZi04ZjI1LThmYTlhMDY5NzIwMCJdLCJleHAiOjE3MzU1NjEyNjMsImlhdCI6MTczNTU2MDk2M30.S_-QI3ZGuenm3wX_0jnB7Nl-Pt3v_L1bGzgx6Zbig8YfwRALyzHp1btrszfhA0mhZg8mbu4IelMj8Nf_tn-TaQ%22%7D%7D%2C%22credential_issuer%22%3A%22https%3A%2F%2Fwallet-cred-issuer-ddunford-example-credential-issuer.mobile.dev.account.gov.uk%22%2C%22credentialIssuer%22%3A%22https%3A%2F%2Fwallet-cred-issuer-ddunford-example-credential-issuer.mobile.dev.account.gov.uk%22%7D",
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
      "https://mobile.test.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22SocialSecurityCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiI5YmM4Y2I2MDQxYzExZTdiYjU1YWYyNDQzNzM4NmU4MTY1MWRhMDlkOTQxN2NjMTgzNTQ3ZjQ1NTliMDk2OWUyIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJhdWQiOiJodHRwczovL3N0dWItY3JlZGVudGlhbC1pc3N1ZXIubW9iaWxlLmRldi5hY2NvdW50Lmdvdi51ayIsImNsaWVudElkIjoiVEVTVF9DTElFTlRfSUQiLCJpc3MiOiJodHRwczovL3dhbGxldC1jcmVkLWlzc3Vlci1kZHVuZm9yZC1leGFtcGxlLWNyZWRlbnRpYWwtaXNzdWVyLm1vYmlsZS5kZXYuYWNjb3VudC5nb3YudWsiLCJjcmVkZW50aWFsX2lkZW50aWZpZXJzIjpbImEyZmNkYzdlLTgxZWYtNDYxZi04ZjI1LThmYTlhMDY5NzIwMCJdLCJleHAiOjE3MzU1NjEyNjMsImlhdCI6MTczNTU2MDk2M30.S_-QI3ZGuenm3wX_0jnB7Nl-Pt3v_L1bGzgx6Zbig8YfwRALyzHp1btrszfhA0mhZg8mbu4IelMj8Nf_tn-TaQ%22%7D%7D%2C%22credential_issuer%22%3A%22https%3A%2F%2Fwallet-cred-issuer-ddunford-example-credential-issuer.mobile.dev.account.gov.uk%22%2C%22credentialIssuer%22%3A%22https%3A%2F%2Fwallet-cred-issuer-ddunford-example-credential-issuer.mobile.dev.account.gov.uk%22%7D",
      "some-staging-app",
      expect.any(Array),
      ""
    );
    expect(res.render).toHaveBeenCalledWith("credential-offer.njk", {
      authenticated: true,
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSU",
      universalLink:
        "https://mobile.build.account.gov.uk/test-wallet/add?credential_offer=testCredentialOffer",
      preAuthorizedCode:
        "eyJraWQiOiI5YmM4Y2I2MDQxYzExZTdiYjU1YWYyNDQzNzM4NmU4MTY1MWRhMDlkOTQxN2NjMTgzNTQ3ZjQ1NTliMDk2OWUyIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJhdWQiOiJodHRwczovL3N0dWItY3JlZGVudGlhbC1pc3N1ZXIubW9iaWxlLmRldi5hY2NvdW50Lmdvdi51ayIsImNsaWVudElkIjoiVEVTVF9DTElFTlRfSUQiLCJpc3MiOiJodHRwczovL3dhbGxldC1jcmVkLWlzc3Vlci1kZHVuZm9yZC1leGFtcGxlLWNyZWRlbnRpYWwtaXNzdWVyLm1vYmlsZS5kZXYuYWNjb3VudC5nb3YudWsiLCJjcmVkZW50aWFsX2lkZW50aWZpZXJzIjpbImEyZmNkYzdlLTgxZWYtNDYxZi04ZjI1LThmYTlhMDY5NzIwMCJdLCJleHAiOjE3MzU1NjEyNjMsImlhdCI6MTczNTU2MDk2M30.S_-QI3ZGuenm3wX_0jnB7Nl-Pt3v_L1bGzgx6Zbig8YfwRALyzHp1btrszfhA0mhZg8mbu4IelMj8Nf_tn-TaQ",
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
