process.env.CREDENTIAL_ISSUER_URL = "http://localhost:1234";
import { getCredentialOffer } from "../../../src/credentialOfferViewer/services/credentialOfferService";
import axios, { AxiosResponse } from "axios";

export const WALLET_SUBJECT_ID: string =
  "urn:fdc:wallet.account.gov.uk:2024:DtPT8x-dp_73tnlY3KNTiCitziN9GEherD16bqxNt9i";

jest.mock("axios");

describe("credentialOfferService.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it("should fetch and return the credential offer URI", async () => {
    const documentId = "2e0fac05-4b38-480f-9cbd-b046eabe1e46";
    const credentialType = "BasicCheckCredential";
    const criResponseMocked = {
      data: {
        credential_offer_uri:
          "https://mobile.test.account.gov.uk/wallet/add?credential_offer=BasicCheckCredential",
      },
    } as AxiosResponse;

    mockedAxios.get.mockResolvedValue(criResponseMocked);

    const response = await getCredentialOffer(
      WALLET_SUBJECT_ID,
      documentId,
      credentialType
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:1234/credential_offer",
      {
        params: {
          credentialType: "BasicCheckCredential",
          documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          walletSubjectId: WALLET_SUBJECT_ID,
        },
      }
    );
    expect(response).toEqual({
      credential_offer_uri:
        "https://mobile.test.account.gov.uk/wallet/add?credential_offer=BasicCheckCredential",
    });
  });

  it("should catch an axios error and throw it", async () => {
    const documentId = "2e0fac05-4b38-480f-9cbd-b046eabe1e46";
    const credentialType = "BasicCheckCredential";
    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedAxios.get.mockRejectedValueOnce(new Error("AXIOS_ERROR"));

    await expect(
      getCredentialOffer(WALLET_SUBJECT_ID, documentId, credentialType)
    ).rejects.toThrow("AXIOS_ERROR");
  });

  it("should catch a non-axios error and throw it", async () => {
    const documentId = "2e0fac05-4b38-480f-9cbd-b046eabe1e46";
    const credentialType = "BasicCheckCredential";
    mockedAxios.isAxiosError.mockReturnValue(false);
    mockedAxios.get.mockRejectedValueOnce(new Error("SOME_ERROR"));

    await expect(
      getCredentialOffer(WALLET_SUBJECT_ID, documentId, credentialType)
    ).rejects.toThrow("SOME_ERROR");
  });
});
