process.env.MOCK_CRI_URL = "http://localhost:1234";
import { getCredentialOffer } from "../../../src/credentialOfferViewer/services/credentialOfferService";
import axios, { AxiosResponse } from "axios";

jest.mock("axios");

describe("credentialOfferService.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedAxios = axios as jest.Mocked<typeof axios>;


  it("should fetch and return the credential offer URI", async () => {
    const walletSubjectId = "walletSubjectIdPlaceholder";
    const documentId = "2e0fac05-4b38-480f-9cbd-b046eabe1e46";
    const criResponseMocked = {
      data: {
        credential_offer_uri:
          "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer",
      },
    } as AxiosResponse;

    mockedAxios.get.mockResolvedValue(criResponseMocked);

    const response = await getCredentialOffer(walletSubjectId, documentId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:1234/credential_offer",
      {
        params: {
          documentId: "2e0fac05-4b38-480f-9cbd-b046eabe1e46",
          walletSubjectId: "walletSubjectIdPlaceholder",
        },
      }
    );
    expect(response).toEqual({
      credential_offer_uri:
        "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer",
    });
  });

  it("should catch an axios error and throw it", async () => {
    const walletSubjectId = "walletSubjectIdPlaceholder";
    const documentId = "2e0fac05-4b38-480f-9cbd-b046eabe1e46";

    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedAxios.get.mockRejectedValueOnce(new Error('AXIOS_ERROR'));

    await expect(
      getCredentialOffer(walletSubjectId, documentId)
    ).rejects.toThrow("AXIOS_ERROR");
  });

  it("should catch a non-axios error and throw it", async () => {
    const walletSubjectId = "walletSubjectIdPlaceholder";
    const documentId = "2e0fac05-4b38-480f-9cbd-b046eabe1e46";

    mockedAxios.isAxiosError.mockReturnValue(false);
    mockedAxios.get.mockRejectedValueOnce(new Error('SOME_ERROR'));

    await expect(
        getCredentialOffer(walletSubjectId, documentId)
    ).rejects.toThrow("SOME_ERROR");
  });
});
