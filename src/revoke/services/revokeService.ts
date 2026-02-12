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
  const revokeUrl = criUrl + REVOKE_PATH + "/" + documentId;

  const response = await axios.post(revokeUrl, null, {
    validateStatus: () => true,
  });

  const statusCode = response.status;
  if (statusCode === 202) {
    return {
      message: "Digital driving licence successfully revoked",
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
