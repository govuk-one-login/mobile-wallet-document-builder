import axios from "axios";
import { getSelfUrl } from "../../config/appConfig";
import { GrantType } from "../../stsStubAccessToken/token/validateTokenRequest";

export async function getAccessToken(
  preAuthorizedCode: string
): Promise<string> {
  const response = await axios.post(
    `${getSelfUrl()}/token`,
    {
      grant_type: GrantType.PREAUTHORIZED_CODE,
      "pre-authorized_code": preAuthorizedCode,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
}
