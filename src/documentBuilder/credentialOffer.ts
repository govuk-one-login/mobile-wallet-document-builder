import axios from "axios";
import { getMockCriEndpoint } from "../config/appConfig";
import { CredentialOfferResponse } from "../types/interfaces";

export async function getCredentialOffer(
  walletSubjectId: string,
  documentId: string
): Promise<CredentialOfferResponse> {
  try {
    console.log("credentialOffer");

    const mockCriUrl = getMockCriEndpoint();
    const credentialOfferUrl = mockCriUrl + "/credential_offer";

    const response = await axios.get(credentialOfferUrl, {
      params: {
        walletSubjectId: walletSubjectId,
        documentId: documentId,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        "Error fetching credential offer:",
        error.response?.data || error.message
      );
    } else {
      console.log("An unexpected error happened:", error);
    }
    throw error;
  }
}
