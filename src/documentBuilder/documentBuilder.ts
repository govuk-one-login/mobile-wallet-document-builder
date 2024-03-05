import {
  CredentialSubject,
  FormData,
  NamePart,
  SocialSecurityRecord,
} from "../types/interfaces";

export function getNameParts(input: FormData) {
  const nameParts: NamePart[] = [];
  if (input.title) {
    nameParts.push({
      value: input.title,
      type: "Title",
    });
  }

  if (input.givenName) {
    const givenNames = input.givenName.split(" ");
    for (const name of givenNames) {
      nameParts.push({
        value: name,
        type: "GivenName",
      });
    }
  }

  if (input.familyName) {
    const familyNames = input.familyName.split(" ");
    for (const surname of familyNames) {
      nameParts.push({
        value: surname,
        type: "FamilyName",
      });
    }
  }

  return nameParts;
}

export function getSocialSecurityRecord(input: FormData) {
  const socialSecurityRecord: SocialSecurityRecord[] = [];
  if (input.nino) {
    socialSecurityRecord.push({
      personalNumber: input.nino,
    });
  }
  return socialSecurityRecord;
}

export class Document {
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
   * @param input {FormData}
   */
  static fromRequestBody(input: FormData): Document {
    this.trimRequestBody(input);

    const type = ["VerifiableCredential", "SocialSecurityCredential"];
    const credentialSubject: CredentialSubject = {
      name: [{ nameParts: getNameParts(input) }],
      socialSecurityRecord: getSocialSecurityRecord(input),
    };

    return new Document(type, credentialSubject);
  }

  private static trimRequestBody(input: FormData) {
    for (const key in input) {
      const trimmed = input[key as keyof FormData]!.trim();
      input[key as keyof FormData] = trimmed
    }
  }
}
