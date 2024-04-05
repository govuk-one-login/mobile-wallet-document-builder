import {
  CredentialSubject,
  NinoCredentialSubject,
  SocialSecurityRecord,
} from "../../types/CredentialSubject";
import { NinoFormData } from "../../types/NinoFormData";
import { getNameParts } from "../../helpers/getNameParts";
import { CredentialType } from "../../types/CredentialType";

export function getSocialSecurityRecord(input: NinoFormData) {
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
  public readonly credentialSubject: CredentialSubject;

  constructor(type: string[], credentialSubject: CredentialSubject) {
    this.type = type;
    this.credentialSubject = credentialSubject;
  }

  /**
   * A static method for mapping a document's details into a document in the verifiable credential structure.
   *
   * @returns a document
   * @param input {NinoFormData}
   * @param credentialType {CredentialType}
   */
  static fromRequestBody(
    input: NinoFormData,
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

  private static trimRequestBody(input: NinoFormData) {
    for (const key in input) {
      const trimmed = input[key as keyof NinoFormData]!.trim();
      input[key as keyof NinoFormData] = trimmed;
    }
  }
}
