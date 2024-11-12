const {createPublicKey, randomUUID}=require("node:crypto")
const bs58=require("bs58")
const {generateKeyPair, CompactSign, exportSPKI} = require("jose");

async function verifySetup() {
    const walletSubjectId = 'urn:fdc:wallet.account.gov.uk:2024:DtPT8x-dp_73tnlY3KNTiCitziN9GEherD16bqxNt9i'
    const credentialIssuerBaseUrl = 'http://localhost:8080'
    const documentBuilderBaseUrl = 'http://localhost:8001'
    // const credentialIssuerBaseUrl = 'https://example-credential-issuer.mobile.build.account.gov.uk'
    // const documentBuilderBaseUrl = 'https://stub-credential-issuer.mobile.build.account.gov.uk'

    const ninoDocumentData = new URLSearchParams({
        title: 'Mr',
        givenName: 'John',
        familyName: 'Smith',
        nino: randomUUID(),
    }).toString()
    const buildNinoDocumentResult = await fetch(`${documentBuilderBaseUrl}/build-nino-document`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: 'id_token=abc; app=wallet-test-build'
        },
        body: ninoDocumentData
    })
    // console.log('POST RESPONSE', buildNinoDocumentResult)
    const documentId = (new URL(buildNinoDocumentResult.url)).pathname.split('/')[2]
    // console.log(documentId)

    const credentialOfferQueryParams = new URLSearchParams({
        walletSubjectId,
        documentId,
        credentialType: 'BasicCheckCredential',
    }).toString()
    const getCredentialOfferUrl = `${credentialIssuerBaseUrl}/credential_offer?${credentialOfferQueryParams}`

    const credentialOfferResult = await fetch(getCredentialOfferUrl, { method: 'GET' })
    const credentialOfferResponseBody = await credentialOfferResult.text()
    console.log('CREDENTIAL OFFER', credentialOfferResponseBody)

    const credentialOfferUri = JSON.parse(credentialOfferResponseBody)['credential_offer_uri']
    const credentialOffer = JSON.parse(new URL(credentialOfferUri).searchParams.get('credential_offer'))
    const preAuthorizedCode = credentialOffer.grants['urn:ietf:params:oauth:grant-type:pre-authorized_code']['pre-authorized_code']
    console.log(preAuthorizedCode)

    const tokenRequestBody = new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        'pre-authorized_code': preAuthorizedCode,
    }).toString()
    const accessTokenResult = await fetch(`${documentBuilderBaseUrl}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenRequestBody
    })
    const accessTokenResponseBody = await accessTokenResult.text()
    const accessToken = JSON.parse(accessTokenResponseBody).access_token
    console.log(accessToken)

    const nonce = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64url')).c_nonce

    // const proofRequestQueryParams = new URLSearchParams({
    //     nonce,
    //     audience: credentialIssuerBaseUrl
    // }).toString()
    // const proofResponse = await fetch(`${documentBuilderBaseUrl}/proof-jwt?${proofRequestQueryParams}`)
    // const proofResponseBody = await proofResponse.text()
    // console.log('PROOF RESPONSE', proofResponseBody)
    // const proofJwt = JSON.parse(proofResponseBody).proofJwt

    const { publicKey, privateKey } = await generateKeyPair('ES256')
    const didKey = getDidKey(await exportSPKI(publicKey))
    const proofPayload = {
        iss: "urn:fdc:gov:uk:wallet",
        aud: credentialIssuerBaseUrl,
        iat: Date.now(),
        nonce,
    };
    const proofJwt = await new CompactSign(new TextEncoder().encode(JSON.stringify(proofPayload))).setProtectedHeader({alg: 'ES256', typ:'JWT', kid: didKey}).sign(privateKey)
    console.log('PROOF JWT', proofJwt)

    const credentialRequestBody = JSON.stringify({
        proof: {
            proof_type: 'jwt',
            jwt: proofJwt
        }
    })
    const credentialResult = await fetch(`${credentialIssuerBaseUrl}/credential`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: credentialRequestBody
    })
    console.log(credentialResult.status)

    const credentialResponseBody = await credentialResult.text()
    const credential = JSON.parse(credentialResponseBody).credential
    console.log('CREDENTIAL', credential)

    console.log(Buffer.from(credential.split('.')[1], 'base64url').toString())
}

function createDidKey(publicKeyJwk) {
    const publicKeyBuffer = getPublicKeyFromJwk(publicKeyJwk);
    const compressedPublicKey = compress(publicKeyBuffer);

    const bytes = new Uint8Array(compressedPublicKey.length + 2);
    bytes[0] = 0x80;
    bytes[1] = 0x24;
    bytes.set(compressedPublicKey, 2);

    const base58EncodedKey = bs58.default.encode(bytes);
    return `did:key:z${base58EncodedKey}`;
}

function getPublicKeyFromJwk(publicKeyJwk) {
    return Buffer.concat([
        Buffer.from(publicKeyJwk.x, "base64"),
        Buffer.from(publicKeyJwk.y, "base64"),
    ]);
}

const compress = (publicKey) => {
    const publicKeyHex = Buffer.from(publicKey).toString("hex");
    const xHex = publicKeyHex.slice(0, publicKeyHex.length / 2);
    const yHex = publicKeyHex.slice(publicKeyHex.length / 2, publicKeyHex.length);
    const xOctet = Uint8Array.from(Buffer.from(xHex, "hex"));
    const yOctet = Uint8Array.from(Buffer.from(yHex, "hex"));
    return compressEcPoint(xOctet, yOctet);
};

function compressEcPoint(x, y) {
    const compressedKey = new Uint8Array(x.length + 1);
    compressedKey[0] = 2 + (y[y.length - 1] & 1);

    compressedKey.set(x, 1);
    return compressedKey;
}

const createJwkFromRawPublicKey = (rawPublicKey) => {
    const stringPublicKey = uint8ArrayToBase64(rawPublicKey);

    const formattedPublicKey =
        "-----BEGIN PUBLIC KEY-----\n" +
        stringPublicKey +
        "\n-----END PUBLIC KEY-----";

    try {
        const jsonWebKey = createPublicKey(rawPublicKey).export({
            format: "jwk",
        });
        return jsonWebKey;
    } catch (error) {
        console.log(error);
        throw new Error("Could not create JWK from raw public key");
    }
};

const uint8ArrayToBase64 = (uint8Array) => {
    return Buffer.from(uint8Array).toString("base64");
};

function getDidKey(publicKeyPem) {
    const publicKeyJwk = createJwkFromRawPublicKey(publicKeyPem)
    return createDidKey(publicKeyJwk)
}

;(async () => await verifySetup())()