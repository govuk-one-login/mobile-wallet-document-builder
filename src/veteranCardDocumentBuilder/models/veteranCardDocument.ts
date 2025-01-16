import { VeteranCardInputData } from "../types/VeteranCardInputData";
import { getNameParts } from "../../utils/getNameParts";
import { CredentialSubject } from "../../types/CredentialSubject";
import { VeteranCredentialSubject } from "../types/VeteranCredentialSubject";
import { base64Photo } from "../base64Photo";
import { CredentialType } from "../../types/CredentialType";

export class VeteranCardDocument {
  public readonly type: string[];
  public readonly credentialSubject: CredentialSubject;

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
    this.trimRequestBody(input);

    const type = ["VerifiableCredential", credentialType];
    const credentialSubject: VeteranCredentialSubject = {
      name: [
        {
          nameParts: getNameParts(input.givenName, input.familyName),
        },
      ],
      birthDate: [
        {
          value: this.getFormattedDate(
            input["dateOfBirth-year"],
            input["dateOfBirth-month"],
            input["dateOfBirth-day"]
          ),
        },
      ],
      veteranCard: [
        {
          expiryDate: this.getFormattedDate(
            input["cardExpiryDate-year"],
            input["cardExpiryDate-month"],
            input["cardExpiryDate-day"]
          ),
          serviceStart: this.getFormattedDate(
            input["serviceStartDate-year"],
            input["serviceStartDate-month"],
            input["serviceStartDate-day"]
          ),
          serviceEnd: this.getFormattedDate(
            input["serviceEndDate-year"],
            input["serviceEndDate-month"],
            input["serviceEndDate-day"]
          ),
          serviceNumber: input.serviceNumber,
          serviceBranch: input.serviceBranch,
          photo: base64Photo,
        },
      ],
    };

    return new VeteranCardDocument(type, credentialSubject);
  }

  private static getFormattedDate(year: string, month: string, day: string) {
    return `${year}-${month}-${day}`;
  }

  private static trimRequestBody(input: VeteranCardInputData) {
    for (const key in input) {
      const trimmed = input[key as keyof VeteranCardInputData]!.trim();
      input[key as keyof VeteranCardInputData] = trimmed;
    }
  }
}
