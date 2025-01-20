import { DbsCredentialSubject } from "../types/DbsCredentialSubject";
import { DbsInputData } from "../types/DbsInputData";
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
   * @param input {DbsInputData}
   * @param credentialType {CredentialType}
   */
  static fromRequestBody(
    input: DbsInputData,
    credentialType: CredentialType
  ): DbsDocument {
    trimRequestBody(input);

    const type = ["VerifiableCredential", credentialType];
    const credentialSubject: DbsCredentialSubject = {
      issuanceDate: `${input["issuance-year"]}-${input["issuance-month"]}-${input["issuance-day"]}`,
      expirationDate: getExpirationDate(),
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
}

function trimRequestBody(input: DbsInputData) {
  for (const key in input) {
    const trimmed = input[key as keyof DbsInputData]!.trim();
    input[key as keyof DbsInputData] = trimmed;
  }
}

export function getExpirationDate() {
  const nextYear = new Date().getFullYear() + 1;
  const dateInOneYearTimestamp = new Date().setFullYear(nextYear);
  const year = new Date(dateInOneYearTimestamp).getFullYear();
  const monthTwoDigits = (
    "0" +
    (new Date(dateInOneYearTimestamp).getMonth() + 1)
  ).slice(-2);
  const dayTwoDigits = ("0" + new Date(dateInOneYearTimestamp).getDate()).slice(
    -2
  );
  return `${year}-${monthTwoDigits}-${dayTwoDigits}`;
}
