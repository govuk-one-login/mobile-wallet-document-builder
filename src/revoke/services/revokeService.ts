import axios from "axios";
import { getCriEndpoint } from "../../config/appConfig";

export interface RevokeResult {
  message: string;
  messageType: "success" | "error" | "info";
}

const REVOKE_PATH = "/revoke";

export async function revokeCredentials(
  drivingLicenceNumber: string,
): Promise<RevokeResult> {
  const revokeUrl = getCriEndpoint() + REVOKE_PATH;

  const response = await axios.post(
    revokeUrl,
    { drivingLicenceNumber },
    {
      validateStatus: () => true,
    },
  );

  const statusCode = response.status;
  if (statusCode === 202) {
    return {
      message: "Credential(s) successfully revoked",
      messageType: "success",
    };
  }
  if (statusCode === 404) {
    return {
      message: "No credential found for this driving licence number",
      messageType: "info",
    };
  }
  return {
    message:
      "Something went wrong and the credential(s) may not have been revoked",
    messageType: "error",
  };
}
