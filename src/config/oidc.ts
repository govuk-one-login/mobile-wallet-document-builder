import { AuthMiddlewareConfiguration } from "../types/AuthMiddlewareConfiguration";
import {
  getBaseUrl,
  getOIDCPrivateKey,
  getOIDCClientId,
  getOIDCDiscoveryEndpoint,
} from "./appConfig";
import { Client, ClientMetadata, Issuer } from "openid-client";
import { readPrivateKey } from "../appSelector/readPrivateKey";

const SCOPES = ["openid", "wallet-subject-id"];

export function getOIDCConfig(): AuthMiddlewareConfiguration {
  return {
    clientId: getOIDCClientId(),
    privateKey: getOIDCPrivateKey(),
    discoveryEndpoint: getOIDCDiscoveryEndpoint(),
    redirectUri: getBaseUrl() + "/return-from-auth",
  } as AuthMiddlewareConfiguration;
}

async function getIssuer(discoveryUri: string) {
  return await Issuer.discover(discoveryUri);
}

export async function getOIDCClient(
  config: AuthMiddlewareConfiguration
): Promise<Client> {
  const jwks = [readPrivateKey(config.privateKey).export({ format: "jwk" })];
  const issuer = await getIssuer(config.discoveryEndpoint);

  const clientMetadata: ClientMetadata = {
    client_id: config.clientId,
    redirect_uris: [config.redirectUri],
    response_types: ["code"],
    token_endpoint_auth_method: "private_key_jwt",
    token_endpoint_auth_signing_alg: "PS256",
    id_token_signed_response_alg: "ES256",
    scopes: SCOPES.join(" "),
  };

  return new issuer.Client(clientMetadata, {
    keys: jwks,
  });
}
