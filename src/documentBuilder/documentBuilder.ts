import {
  CredentialSubject,
  DocumentDetails,
  NamePart,
  SocialSecurityRecord,
} from "../types/interfaces";

function getNameParts(input: DocumentDetails) {
  console.log(input);
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

function getSocialSecurityRecord(input: DocumentDetails) {
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
   * @param input {DocumentDetails}
   */
  static fromRequestBody(input: DocumentDetails): Document {
    const type = ["VerifiableCredential", "SocialSecurityCredential"];
    const credentialSubject: CredentialSubject = {
      name: [{ nameParts: getNameParts(input) }],
      socialSecurityRecord: getSocialSecurityRecord(input),
    };

    return new Document(type, credentialSubject);
  }
}
