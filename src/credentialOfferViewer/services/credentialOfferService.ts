import axios from "axios";
import { getCriEndpoint } from "../../config/appConfig";
import { CredentialOfferResponse } from "../../types/CredentialOfferResponse";

const CREDENTIAL_OFFER_PATH = "/credential_offer";

export async function getCredentialOffer(
  walletSubjectId: string,
  documentId: string,
  credentialType: string
): Promise<CredentialOfferResponse> {
  try {
    const criUrl = getCriEndpoint();
    const credentialOfferUrl = criUrl + CREDENTIAL_OFFER_PATH;

    const response = await axios.get(credentialOfferUrl, {
      params: {
        walletSubjectId: walletSubjectId,
        documentId: documentId,
        credentialType: credentialType,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        `Error fetching credential offer for documentId ${documentId}:
        ${error.response?.data || error.message}`
      );
    } else {
      console.log(`An unexpected error happened: ${error}`);
    }
    throw error;
  }
}
