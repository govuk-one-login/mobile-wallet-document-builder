import { DbsCredentialSubject } from "../types/DbsCredentialSubject";
import { DbsRequestBody } from "../types/DbsRequestBody";
import { getNameParts } from "../../utils/getNameParts";
import { CredentialType } from "../../types/CredentialType";

export class DbsDocument {
  public readonly type: string[];
  public readonly credentialSubject: DbsCredentialSubject;

  constructor(type: string[], credentialSubject: DbsCredentialSubject) {
    this.type = type;
    this.credentialSubject = credentialSubject;
  }

  /**
   * A static method for mapping a document's details into a document in the verifiable credential structure.
   *
   * @returns a document
   * @param input {DbsRequestBody}
   * @param credentialType {CredentialType}
   */
  static fromRequestBody(
    input: DbsRequestBody,
    credentialType: CredentialType,
  ): DbsDocument {
    this.trimRequestBody(input);

    const type = ["VerifiableCredential", credentialType];
    const credentialSubject: DbsCredentialSubject = {
      issuanceDate: `${input["issuance-year"]}-${input["issuance-month"]}-${input["issuance-day"]}`,
      expirationDate: `${input["expiration-year"]}-${input["expiration-month"]}-${input["expiration-day"]}`,
      name: [{ nameParts: getNameParts(input.firstName, input.lastName) }],
      birthDate: [
        {
          value: `${input["birth-year"]}-${input["birth-month"]}-${input["birth-day"]}`,
        },
      ],
      address: [
        {
          subBuildingName: input.subBuildingName,
          buildingName: input.buildingName,
          streetName: input.streetName,
          addressLocality: input.addressLocality,
          postalCode: input.postalCode,
          addressCountry: input.addressCountry,
        },
      ],
      basicCheckRecord: [
        {
          certificateNumber: input.certificateNumber,
          applicationNumber: input.applicationNumber,
          certificateType: "basic",
          outcome: "Result clear",
          policeRecordsCheck: "Clear",
        },
      ],
    };

    return new DbsDocument(type, credentialSubject);
  }

  private static trimRequestBody(input: DbsRequestBody) {
    for (const key in input) {
      const trimmed = input[key as keyof DbsRequestBody]!.trim();
      input[key as keyof DbsRequestBody] = trimmed;
    }
  }
}
