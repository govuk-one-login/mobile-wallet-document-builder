import { JsonWebKey } from "node:crypto";

export class VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk: JsonWebKey;

  constructor(
    id: string,
    type: string,
    controller: string,
    publicKeyJwk: JsonWebKey
  ) {
    this.id = id;
    this.type = type;
    this.controller = controller;
    this.publicKeyJwk = publicKeyJwk;
  }
}
