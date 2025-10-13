import axios from "axios";

export interface RevokeResult {
  message: string;
  messageType: "success" | "error" | "info";
}

const REVOKE_PATH = "/revoke";

export async function revokeCredentials(
  criUrl: string,
  documentId: string,
): Promise<RevokeResult> {
  const revokeUrl = criUrl + REVOKE_PATH;

  const response = await axios.post(revokeUrl, {
    validateStatus: () => true,
    params: { documentId },
  });

  const statusCode = response.status;
  if (statusCode === 202) {
    return {
      message: "Credential(s) successfully revoked",
      messageType: "success",
    };
  }
  if (statusCode === 404) {
    return {
      message: "No credential found for this document identifier",
      messageType: "info",
    };
  }
  return {
    message:
      "Something went wrong and the credential(s) may not have been revoked",
    messageType: "error",
  };
}
