import {
  NinoCredentialSubject,
  SocialSecurityRecord,
} from "../types/NinoCredentialSubject";
import { NinoRequestBody } from "../types/NinoRequestBody";
import { getNameParts } from "../../utils/getNameParts";
import { CredentialType } from "../../types/CredentialType";

export function getSocialSecurityRecord(input: NinoRequestBody) {
  const socialSecurityRecord: SocialSecurityRecord[] = [];
  if (input.nino) {
    socialSecurityRecord.push({
      personalNumber: input.nino,
    });
  }
  return socialSecurityRecord;
}

export class NinoDocument {
  public readonly type: string[];
  public readonly credentialSubject: NinoCredentialSubject;

  constructor(type: string[], credentialSubject: NinoCredentialSubject) {
    this.type = type;
    this.credentialSubject = credentialSubject;
  }

  /**
   * A static method for mapping a document's details into a document in the verifiable credential structure.
   *
   * @returns a document
   * @param input {NinoRequestBody}
   * @param credentialType {CredentialType}
   */
  static fromRequestBody(
    input: NinoRequestBody,
    credentialType: CredentialType
  ): NinoDocument {
    this.trimRequestBody(input);

    const type = ["VerifiableCredential", credentialType];
    const credentialSubject: NinoCredentialSubject = {
      name: [
        {
          nameParts: getNameParts(
            input.givenName,
            input.familyName,
            input.title
          ),
        },
      ],
      socialSecurityRecord: getSocialSecurityRecord(input),
    };

    return new NinoDocument(type, credentialSubject);
  }

  private static trimRequestBody(input: NinoRequestBody) {
    for (const key in input) {
      const trimmed = input[key as keyof NinoRequestBody]!.trim();
      input[key as keyof NinoRequestBody] = trimmed;
    }
  }
}
