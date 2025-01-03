import axios from "axios";
import { getSelfUrl } from "../../config/appConfig";

export async function getProofJwt(
  c_nonce: string,
  audience: string
): Promise<string> {
  const proofJwtResponse = await axios.get(
    `${getSelfUrl()}/proof-jwt?nonce=${c_nonce}&audience=${audience}`
  );
  return proofJwtResponse.data.proofJwt;
}
