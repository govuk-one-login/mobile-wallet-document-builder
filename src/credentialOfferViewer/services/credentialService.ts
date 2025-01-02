import { getCriEndpoint } from "../../config/appConfig";
import axios from "axios";
import { logger } from "../../middleware/logger";

const CREDENTIAL_PATH = "/credential";

export async function getCredential(
  accessToken: string,
  proofJwt: string
): Promise<string> {
  try {
    const criUrl = getCriEndpoint();
    const credentialUrl = criUrl + CREDENTIAL_PATH;

    const response = await axios.post(
      credentialUrl,
      {
        proof: {
          proof_type: "jwt",
          jwt: proofJwt,
        },
      },
      {
        headers: {
          Authorization: `BEARER ${accessToken}`,
        },
      }
    );

    logger.info(`Fetched credential with accessToken ${accessToken}`);

    return response.data.credential;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Error fetching credential with accessToken ${accessToken}`);
      logger.error(error);
    } else {
      logger.error(
        `Unexpected error happened fetching credential with accessToken ${accessToken}`
      );
    }
    throw error;
  }
}
