import { VerificationMethod } from "./verificationMethod";

export class DidDocument {
  "@context": string[];
  id: string;
  verificationMethod: VerificationMethod[];
  assertionMethod: string[];

  constructor(
    context: string[],
    id: string,
    verificationMethod: VerificationMethod[],
    assertionMethod: string[]
  ) {
    this["@context"] = context;
    this.id = id;
    this.verificationMethod = verificationMethod;
    this.assertionMethod = assertionMethod;
  }
}
