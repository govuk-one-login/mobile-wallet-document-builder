import { VeteranCardInputData } from "../types/VeteranCardInputData";
import { getNameParts } from "../../utils/getNameParts";
import { CredentialType } from "../../types/CredentialType";
import { CredentialSubject } from "../../types/CredentialSubject";

export class VeteranCardDocument {
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
   * @param input {VeteranCardInputData}
   * @param credentialType {CredentialType}
   */
  static fromRequestBody(
    input: VeteranCardInputData,
    credentialType: CredentialType
  ): VeteranCardDocument {
    this.trimRequestBody(input);

    const type = ["VerifiableCredential", credentialType];
    const credentialSubject: CredentialSubject = {
      name: [
        {
          nameParts: getNameParts(input.givenName, input.familyName),
        },
      ],
    };

    return new VeteranCardDocument(type, credentialSubject);
  }

  private static trimRequestBody(input: VeteranCardInputData) {
    for (const key in input) {
      const trimmed = input[key as keyof VeteranCardInputData]!.trim();
      input[key as keyof VeteranCardInputData] = trimmed;
    }
  }
}
