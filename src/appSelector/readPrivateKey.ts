import {createPrivateKey} from "node:crypto";

export function readPrivateKey(privateKey: string) {
    return createPrivateKey({
        key: Buffer.from(privateKey, "base64"),
        type: "pkcs8",
        format: "der",
    })
}