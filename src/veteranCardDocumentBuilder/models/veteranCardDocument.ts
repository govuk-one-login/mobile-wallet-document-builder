import { VeteranCardRequestBody } from "../types/VeteranCardRequestBody";
import { getNameParts } from "../../utils/getNameParts";
import { VeteranCredentialSubject } from "../types/VeteranCredentialSubject";
import { CredentialType } from "../../types/CredentialType";

export class VeteranCardDocument {
  public readonly type: string[];
  public readonly credentialSubject: VeteranCredentialSubject;

  constructor(type: string[], credentialSubject: VeteranCredentialSubject) {
    this.type = type;
    this.credentialSubject = credentialSubject;
  }

  /**
   * A static method for mapping a document's details into a document in the verifiable credential structure.
   *
   * @returns a document
   * @param input {VeteranCardRequestBody}
   * @param credentialType {CredentialType}
   * @param photoLocation {string}
   */
  static fromRequestBody(
    input: VeteranCardRequestBody,
    credentialType: CredentialType,
    photoLocation: string
  ): VeteranCardDocument {
    trimRequestBody(input);

    const type = ["VerifiableCredential", credentialType];
    const credentialSubject: VeteranCredentialSubject = {
      name: [
        {
          nameParts: getNameParts(input.givenName, input.familyName),
        },
      ],
      birthDate: [
        {
          value: getFormattedDate(
            input["dateOfBirth-year"],
            input["dateOfBirth-month"],
            input["dateOfBirth-day"]
          ),
        },
      ],
      veteranCard: [
        {
          expiryDate: getFormattedDate(
            input["cardExpiryDate-year"],
            input["cardExpiryDate-month"],
            input["cardExpiryDate-day"]
          ),
          serviceNumber: input.serviceNumber,
          serviceBranch: input.serviceBranch,
          photo: photoLocation,
        },
      ],
    };

    return new VeteranCardDocument(type, credentialSubject);
  }
}

function trimRequestBody(input: VeteranCardRequestBody) {
  for (const key in input) {
    const trimmed = input[key as keyof VeteranCardRequestBody].trim();
    input[key as keyof VeteranCardRequestBody] = trimmed;
  }
}

function getFormattedDate(year: string, month: string, day: string) {
  return `${year}-${month}-${day}`;
}
