import axios from "axios";
import { getCriEndpoint } from "../../config/appConfig";
import { logger } from "../../middleware/logger";

const CREDENTIAL_OFFER_PATH = "/credential_offer";

export async function getCredentialOfferUrl(
  walletSubjectId: string,
  documentId: string,
  credentialType: string,
): Promise<string> {
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
}
