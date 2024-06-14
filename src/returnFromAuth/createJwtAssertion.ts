import jose from "jose";
import {readPrivateKey} from "../appSelector/readPrivateKey";
import {getOIDCPrivateKey, getTokenTtlInSecs} from "../config/appConfig";

export async function createJwtAssertion(clientId: string, tokenEndpoint: string) {
    const privateKey = readPrivateKey(getOIDCPrivateKey());
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + Number(getTokenTtlInSecs());

    return await new jose.SignJWT()
        .setAudience(tokenEndpoint)
        .setSubject(clientId)
        .setIssuer(clientId)
        .setIssuedAt(iat)
        .setExpirationTime(exp)
        .sign(privateKey)
}