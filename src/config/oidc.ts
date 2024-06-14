import { AuthMiddlewareConfiguration } from "../types/AuthMiddlewareConfiguration";
import {
    getOIDCRedirectUri,
    getOIDCPrivateKey,
    getOIDCClientId, getOIDCIssuer,
} from "./appConfig";
import {Client, ClientMetadata, Issuer} from "openid-client";
import {readPrivateKey} from "../appSelector/readPrivateKey";

const SCOPES = [
    "openid", // Always included
    "wallet-subject-id", // Returns the user's walletSubjectId
];

export function getOIDCConfig(): AuthMiddlewareConfiguration {
    return {
        clientId: getOIDCClientId(),
        privateKey: getOIDCPrivateKey(),
        discoveryEndpoint: getOIDCIssuer(),
        redirectUri: getOIDCRedirectUri(),
    } as AuthMiddlewareConfiguration;
}

async function getIssuer(discoveryUri: string) {
    return await Issuer.discover(discoveryUri);
}

export async function getOIDCClient(config: AuthMiddlewareConfiguration): Promise<Client> {
    const jwks = [readPrivateKey(config.privateKey).export({format: "jwk"})];
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

    // what is the point of adding the jwks?
    // JWK Set formatted object with private keys used for signing client assertions or decrypting responses
    return new issuer.Client(clientMetadata, {
        keys: jwks
    });
}