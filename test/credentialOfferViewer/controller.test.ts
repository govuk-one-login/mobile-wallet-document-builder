import { credentialOfferViewerController } from "../../src/credentialOfferViewer/controller";
import * as credentialOfferService from "../../src/credentialOfferViewer/services/credentialOfferService";
import * as customCredentialOfferUrl from "../../src/credentialOfferViewer/helpers/customCredentialOfferUrl";
import { getMockReq, getMockRes } from "@jest-mock/express";

const ENVIRONMENT = "test";
process.env.ENVIRONMENT = ENVIRONMENT;

const WALLET_SUBJECT_ID =
  "urn:fdc:wallet.account.gov.uk:2024:DtPT8x-dp_73tnlY3KNTiCitziN9GEherD16bqxNt9i";

jest.mock(
  "../../src/credentialOfferViewer/services/credentialOfferService",
  () => ({
    getCredentialOfferUrl: jest.fn(),
  }),
);
jest.mock(
  "../../src/credentialOfferViewer/helpers/customCredentialOfferUrl",
  () => ({
    customiseCredentialOfferUrl: jest.fn(),
  }),
);
jest.mock("qrcode", () => ({
  toDataURL: () => "data:image/png;base64,iVBORw0KGgoAAAANSU",
}));

describe("controller.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const getCredentialOfferUrl =
    credentialOfferService.getCredentialOfferUrl as jest.Mock;
  const customiseCredentialOfferUrl =
    customCredentialOfferUrl.customiseCredentialOfferUrl as jest.Mock;

  const req = getMockReq({
    params: {
      itemId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
    },
    cookies: {
      app: "some-build-app",
      id_token: "id_token",
      wallet_subject_id: WALLET_SUBJECT_ID,
    },
    query: {
      type: "BasicCheckCredential",
      error: "",
    },
  });
  const { res } = getMockRes();

  it("should render the credential offer page", async () => {
    const credentialOfferMocked =
      "https://mobile.dev.account.gov.uk/wallet-test/add?credential_offer=%7B%22credentials%22%3A%5B%22SocialSecurityCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiI3OGZhMTMxZDY3N2MxYWMwZjE3MmM1M2I0N2FjMTY5YTk1YWQwZDkyYzM4YmQ3OTRhNzBkYTU5MDMyMDU4Mjc0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwMDEiLCJjbGllbnRJZCI6IlRFU1RfQ0xJRU5UX0lEIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3JlZGVudGlhbF9pZGVudGlmaWVycyI6WyI1ZjM5YTY4Zi02M2MzLTRkMGYtODdlNy0yNGYyNzRjZWJkYWYiXSwiZXhwIjoxNzM2NTA2NzkzLCJpYXQiOjE3MzY1MDY0OTN9.AHeaVwMBqlTOO1Qmgg38-OWiSTs-AmEtLJafz6Ks31CCqHiXJ_QujmK5jJGWpry8X84FSksPhhGoTIG61TbLuQ%22%7D%7D%2C%22credential_issuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";

    getCredentialOfferUrl.mockReturnValueOnce(credentialOfferMocked);
    customiseCredentialOfferUrl.mockReturnValueOnce(
      `https://mobile.build.account.gov.uk/test-wallet/add?credential_offer=${credentialOfferMocked}`,
    );

    await credentialOfferViewerController(req, res);

    expect(getCredentialOfferUrl).toHaveBeenCalledWith(
      WALLET_SUBJECT_ID,
      "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
      "BasicCheckCredential",
    );
    expect(customiseCredentialOfferUrl).toHaveBeenCalledWith(
      "https://mobile.dev.account.gov.uk/wallet-test/add?credential_offer=%7B%22credentials%22%3A%5B%22SocialSecurityCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiI3OGZhMTMxZDY3N2MxYWMwZjE3MmM1M2I0N2FjMTY5YTk1YWQwZDkyYzM4YmQ3OTRhNzBkYTU5MDMyMDU4Mjc0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwMDEiLCJjbGllbnRJZCI6IlRFU1RfQ0xJRU5UX0lEIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3JlZGVudGlhbF9pZGVudGlmaWVycyI6WyI1ZjM5YTY4Zi02M2MzLTRkMGYtODdlNy0yNGYyNzRjZWJkYWYiXSwiZXhwIjoxNzM2NTA2NzkzLCJpYXQiOjE3MzY1MDY0OTN9.AHeaVwMBqlTOO1Qmgg38-OWiSTs-AmEtLJafz6Ks31CCqHiXJ_QujmK5jJGWpry8X84FSksPhhGoTIG61TbLuQ%22%7D%7D%2C%22credential_issuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D",
      "some-build-app",
      expect.any(Array),
      "",
    );
    expect(res.render).toHaveBeenCalledWith("credential-offer.njk", {
      authenticated: true,
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSU",
      universalLink:
        "https://mobile.build.account.gov.uk/test-wallet/add?credential_offer=https://mobile.dev.account.gov.uk/wallet-test/add?credential_offer=%7B%22credentials%22%3A%5B%22SocialSecurityCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiI3OGZhMTMxZDY3N2MxYWMwZjE3MmM1M2I0N2FjMTY5YTk1YWQwZDkyYzM4YmQ3OTRhNzBkYTU5MDMyMDU4Mjc0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwMDEiLCJjbGllbnRJZCI6IlRFU1RfQ0xJRU5UX0lEIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3JlZGVudGlhbF9pZGVudGlmaWVycyI6WyI1ZjM5YTY4Zi02M2MzLTRkMGYtODdlNy0yNGYyNzRjZWJkYWYiXSwiZXhwIjoxNzM2NTA2NzkzLCJpYXQiOjE3MzY1MDY0OTN9.AHeaVwMBqlTOO1Qmgg38-OWiSTs-AmEtLJafz6Ks31CCqHiXJ_QujmK5jJGWpry8X84FSksPhhGoTIG61TbLuQ%22%7D%7D%2C%22credential_issuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D",
      environment: ENVIRONMENT,
    });
  });

  it("should render an error page when an error happens", async () => {
    getCredentialOfferUrl.mockRejectedValueOnce(new Error("SOME_ERROR"));

    await credentialOfferViewerController(req, res);

    expect(res.render).toHaveBeenCalledWith("500.njk");
  });
});
