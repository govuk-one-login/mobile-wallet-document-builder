import {
  CredentialSubject,
  DbsCredentialSubject,
} from "../../types/CredentialSubject";
import { DbsFormData } from "../../types/NinoFormData";
import { getNameParts } from "../../helpers/getNameParts";

function getExpirationDate() {
  const dateInOneYear = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  );
  const dateFormatted = `${
    dateInOneYear.getFullYear
  }-${dateInOneYear.getMonth()}-${dateInOneYear.getDay()}`;
  return dateFormatted;
}

export class DbsDocument {
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
   * @param input {DbsFormData}
   */
  static fromRequestBody(input: DbsFormData): DbsDocument {
    this.trimRequestBody(input);

    const type = ["VerifiableCredential", "BasicCheckCredential"];
    const credentialSubject: DbsCredentialSubject = {
      issuanceDate: `${input["issuance-year"]}-${input["issuance-month"]}-${input["issuance-day"]}`,
      expirationDate: getExpirationDate(),
      name: [{ nameParts: getNameParts(input.firstName, input.lastName) }],
      birthDate: [
        {
          value: `${input["issuance-year"]}-${input["issuance-month"]}-${input["issuance-day"]}`,
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

  private static trimRequestBody(input: DbsFormData) {
    for (const key in input) {
      const trimmed = input[key as keyof DbsFormData]!.trim();
      input[key as keyof DbsFormData] = trimmed;
    }
  }
}
