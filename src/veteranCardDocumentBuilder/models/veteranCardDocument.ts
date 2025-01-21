import { VeteranCardInputData } from "../types/VeteranCardInputData";
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
   * @param input {VeteranCardInputData}
   * @param credentialType {CredentialType}
   */
  static fromRequestBody(
    input: VeteranCardInputData,
    credentialType: CredentialType
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
          photo: "",
        },
      ],
    };

    return new VeteranCardDocument(type, credentialSubject);
  }
}

function trimRequestBody(input: VeteranCardInputData) {
  for (const key in input) {
    const trimmed = input[key as keyof VeteranCardInputData].trim();
    input[key as keyof VeteranCardInputData] = trimmed;
  }
}

function getFormattedDate(year: string, month: string, day: string) {
  return `${year}-${month}-${day}`;
}
