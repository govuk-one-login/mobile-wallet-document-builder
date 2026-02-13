import axios from "axios";

const REVOKE_PATH = "/revoke";

export async function revokeCredentials(
  criUrl: string,
  documentId: string,
): Promise<number> {
  const revokeUrl = criUrl + REVOKE_PATH + "/" + documentId;

  const response = await axios.post(revokeUrl, null, {
    validateStatus: () => true,
  });

  return response.status;
}
