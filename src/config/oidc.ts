import { AuthMiddlewareConfiguration } from "../types/AuthMiddlewareConfiguration";
import {
    getOIDCRedirectUri,
    getOIDCPrivateKey,
    getOIDCClientId, getOIDCIssuerDiscoveryEndpoint,
} from "./appConfig";
import {Client, ClientMetadata, Issuer} from "openid-client";
import {createPrivateKey} from "node:crypto";

const SCOPES = [
    "openid", // Always included
    "wallet-subject-id", // Returns the user's walletSubjectId
];

export function getOIDCConfig(): AuthMiddlewareConfiguration {
    return {
        clientId: getOIDCClientId(),
        privateKey: getOIDCPrivateKey(),
        discoveryEndpoint: getOIDCIssuerDiscoveryEndpoint(),
        redirectUri: getOIDCRedirectUri(),
    } as AuthMiddlewareConfiguration;
}

async function getIssuer(discoveryUri: string) {
    return await Issuer.discover(discoveryUri);
}

export function readPrivateKeyAsJwk(privateKey: string) {
    return [createPrivateKey({
        key: Buffer.from(privateKey, "base64"),
        type: "pkcs8",
        format: "der",
    }).export({format: "jwk"})]
}

export async function getOIDCClient(config: AuthMiddlewareConfiguration): Promise<Client> {
    const jwks = readPrivateKeyAsJwk(config.privateKey);
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
        keys: jwks
    });
}