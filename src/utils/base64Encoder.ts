export function base64Encoder(object: object) {
  return Buffer.from(JSON.stringify(object)).toString("base64url");
}
