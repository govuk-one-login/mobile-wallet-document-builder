import { DbsDocument } from "../../../src/dbsDocumentBuilder/models/dbsDocument";
import { CredentialType } from "../../../src/types/CredentialType";

describe("dbsDocument.ts", () => {
  beforeEach(() => {
    const mockedDate = new Date(2024, 3, 5);

    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return the DBS document in the correct format and without any whitespaces", () => {
    const requestBody = {
      "issuance-day": "16",
      "issuance-month": "1",
      "issuance-year": " 2025",
      "expiration-day": "16",
      "expiration-month": "1",
      "expiration-year": " 2026",
      firstName: "Sarah Elizabeth",
      lastName: "Edwards   ",
      "birth-day": "6",
      "birth-month": "   3",
      "birth-year": "1980",
      subBuildingName: "Flat 11",
      buildingName: "   Blashford",
      streetName: "Adelaide Road ",
      addressLocality: "London   ",
      addressCountry: "  GB",
      postalCode: "   NW3 3RX    ",
      certificateNumber: "   009878863",
      applicationNumber: "E0023455534   ",
      throwError: "",
    };

    const document = DbsDocument.fromRequestBody(
      requestBody,
      <CredentialType>"BasicCheckCredential"
    );

    expect(document).toEqual({
      type: ["VerifiableCredential", "BasicCheckCredential"],
      credentialSubject: {
        issuanceDate: "2025-1-16",
        expirationDate: "2026-1-16",
        name: [
          {
            nameParts: [
              { type: "GivenName", value: "Sarah" },
              {
                type: "GivenName",
                value: "Elizabeth",
              },
              { type: "FamilyName", value: "Edwards" },
            ],
          },
        ],
        birthDate: [{ value: "1980-3-6" }],
        address: [
          {
            addressCountry: "GB",
            addressLocality: "London",
            buildingName: "Blashford",
            postalCode: "NW3 3RX",
            streetName: "Adelaide Road",
            subBuildingName: "Flat 11",
          },
        ],
        basicCheckRecord: [
          {
            applicationNumber: "E0023455534",
            certificateNumber: "009878863",
            certificateType: "basic",
            outcome: "Result clear",
            policeRecordsCheck: "Clear",
          },
        ],
      },
    });
  });

  it("should return the DBS document with empty string values when fields are left blank", () => {
    const requestBody = {
      "issuance-day": "",
      "issuance-month": "",
      "issuance-year": "2024",
      "expiration-day": "",
      "expiration-month": "1",
      "expiration-year": " 2026",
      firstName: "Sarah",
      lastName: "Edwards",
      "birth-day": "6",
      "birth-month": "",
      "birth-year": "1980",
      subBuildingName: "FLAT 11",
      buildingName: "",
      streetName: "ADELAIDE ROAD",
      addressLocality: "LONDON",
      addressCountry: "GB",
      postalCode: "NW3 3RX",
      certificateNumber: "",
      applicationNumber: "",
      throwError: "",
    };

    const document = DbsDocument.fromRequestBody(
      requestBody,
      <CredentialType>"BasicCheckCredential"
    );

    expect(document).toEqual({
      credentialSubject: {
        address: [
          {
            addressCountry: "GB",
            addressLocality: "LONDON",
            buildingName: "",
            postalCode: "NW3 3RX",
            streetName: "ADELAIDE ROAD",
            subBuildingName: "FLAT 11",
          },
        ],
        basicCheckRecord: [
          {
            applicationNumber: "",
            certificateNumber: "",
            certificateType: "basic",
            outcome: "Result clear",
            policeRecordsCheck: "Clear",
          },
        ],
        birthDate: [{ value: "1980--6" }],
        expirationDate: "2026-1-",
        issuanceDate: "2024--",
        name: [
          {
            nameParts: [
              { type: "GivenName", value: "Sarah" },
              { type: "FamilyName", value: "Edwards" },
            ],
          },
        ],
      },
      type: ["VerifiableCredential", "BasicCheckCredential"],
    });
  });

  it("should return the first name and issue year as provided", () => {
    const requestBody = {
      "issuance-day": "16",
      "issuance-month": "1",
      "issuance-year": "cab=*;ds",
      "expiration-day": "16",
      "expiration-month": "1",
      "expiration-year": " 2026",
      firstName: "&9hj,%^y",
      lastName: "Edwards",
      "birth-day": "6",
      "birth-month": "3",
      "birth-year": "1980",
      subBuildingName: "Flat 11",
      buildingName: "Blashford",
      streetName: "Adelaide Road",
      addressLocality: "London",
      addressCountry: "GB",
      postalCode: "NW3 3RX",
      certificateNumber: "009878863",
      applicationNumber: "E0023455534",
      throwError: "",
    };

    const document = DbsDocument.fromRequestBody(
      requestBody,
      <CredentialType>"BasicCheckCredential"
    );

    expect(document).toEqual({
      credentialSubject: {
        address: [
          {
            addressCountry: "GB",
            addressLocality: "London",
            buildingName: "Blashford",
            postalCode: "NW3 3RX",
            streetName: "Adelaide Road",
            subBuildingName: "Flat 11",
          },
        ],
        basicCheckRecord: [
          {
            applicationNumber: "E0023455534",
            certificateNumber: "009878863",
            certificateType: "basic",
            outcome: "Result clear",
            policeRecordsCheck: "Clear",
          },
        ],
        birthDate: [{ value: "1980-3-6" }],
        expirationDate: "2026-1-16",
        issuanceDate: "cab=*;ds-1-16",
        name: [
          {
            nameParts: [
              { type: "GivenName", value: "&9hj,%^y" },
              {
                type: "FamilyName",
                value: "Edwards",
              },
            ],
          },
        ],
      },
      type: ["VerifiableCredential", "BasicCheckCredential"],
    });
  });
});
