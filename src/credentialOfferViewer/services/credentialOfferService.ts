import axios from "axios";
import { getCriEndpoint } from "../../config/appConfig";
import { CredentialOfferResponse } from "../types/CredentialOfferResponse";
import { logger } from "../../utils/logger";

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

    logger.info(`Fetched credential offer for documentId ${documentId}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(
        `Error fetching credential offer for documentId ${documentId}`
      );
    } else {
      logger.error(
        `Unexpected error happened fetching credential offer for documentId ${documentId}`
      );
    }
    throw error;
  }
}
