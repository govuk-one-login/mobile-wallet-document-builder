import { VeteranCardDocument } from "../../../src/veteranCardDocumentBuilder/models/veteranCardDocument";
import { CredentialType } from "../../../src/types/CredentialType";

describe("veteranCardDocument.ts", () => {
  beforeEach(() => {
    const mockedDate = new Date(2024, 3, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("VeteranCardDocument", () => {
    it("should return the Veteran Card document in the correct format and without any whitespaces", () => {
      const documentDetails = {
        givenName: "   Sarah Elizabeth",
        familyName: "Edwards-Smith    ",
        "dateOfBirth-day": "06",
        "dateOfBirth-month": "  03",
        "dateOfBirth-year": "1975",
        "cardExpiryDate-day": "08   ",
        "cardExpiryDate-month": "04 ",
        "cardExpiryDate-year": "  2029 ",
        serviceNumber: "   25057386   ",
        serviceBranch: "   HM Naval Service",
        throwError: "",
      };

      const document = VeteranCardDocument.fromRequestBody(
        documentDetails,
        CredentialType.digitalVeteranCard
      );

      expect(document).toEqual({
        credentialSubject: {
          birthDate: [{ value: "1975-03-06" }],
          name: [
            {
              nameParts: [
                { type: "GivenName", value: "Sarah" },
                { type: "GivenName", value: "Elizabeth" },
                { type: "FamilyName", value: "Edwards-Smith" },
              ],
            },
          ],
          veteranCard: [
            {
              expiryDate: "2029-04-08",
              photo: "",
              serviceBranch: "HM Naval Service",
              serviceNumber: "25057386",
            },
          ],
        },
        type: ["VerifiableCredential", "digitalVeteranCard"],
      });
    });

    it("should return the Veteran Card document without the GivenName key when a given name is not provided", () => {
      const documentDetails = {
        givenName: "",
        familyName: "Edwards",
        "dateOfBirth-day": "06",
        "dateOfBirth-month": "03",
        "dateOfBirth-year": "1975",
        "cardExpiryDate-day": "08",
        "cardExpiryDate-month": "04",
        "cardExpiryDate-year": "2029",
        serviceNumber: "25057386",
        serviceBranch: "HM Naval Service",
        throwError: "",
      };

      const document = VeteranCardDocument.fromRequestBody(
        documentDetails,
        CredentialType.digitalVeteranCard
      );

      expect(document).toEqual({
        type: ["VerifiableCredential", "digitalVeteranCard"],
        credentialSubject: {
          name: [{ nameParts: [{ value: "Edwards", type: "FamilyName" }] }],
          birthDate: [{ value: "1975-03-06" }],
          veteranCard: [
            {
              expiryDate: "2029-04-08",
              serviceNumber: "25057386",
              serviceBranch: "HM Naval Service",
              photo: "",
            },
          ],
        },
      });
    });

    it("should return the Veteran Card document with an empty string value for serviceNumber when a value is not provided", () => {
      const documentDetails = {
        givenName: "Ana",
        familyName: "Edwards",
        "dateOfBirth-day": "06",
        "dateOfBirth-month": "03",
        "dateOfBirth-year": "1975",
        "cardExpiryDate-day": "08",
        "cardExpiryDate-month": "04",
        "cardExpiryDate-year": "2029",
        serviceNumber: "",
        serviceBranch: "HM Naval Service",
        throwError: "",
      };

      const document = VeteranCardDocument.fromRequestBody(
        documentDetails,
        CredentialType.digitalVeteranCard
      );

      expect(document).toEqual({
        type: ["VerifiableCredential", "digitalVeteranCard"],
        credentialSubject: {
          name: [
            {
              nameParts: [
                { value: "Ana", type: "GivenName" },
                { value: "Edwards", type: "FamilyName" },
              ],
            },
          ],
          birthDate: [{ value: "1975-03-06" }],
          veteranCard: [
            {
              expiryDate: "2029-04-08",
              serviceNumber: "",
              serviceBranch: "HM Naval Service",
              photo: "",
            },
          ],
        },
      });
    });

    it("should return the Veteran Card document with incomplete dates when a complete date is not provided", () => {
      const documentDetails = {
        givenName: "Ana",
        familyName: "Edwards",
        "dateOfBirth-day": "06",
        "dateOfBirth-month": "03",
        "dateOfBirth-year": "",
        "cardExpiryDate-day": "",
        "cardExpiryDate-month": "",
        "cardExpiryDate-year": "",
        serviceNumber: "25057386",
        serviceBranch: "HM Naval Service",
        throwError: "",
      };

      const document = VeteranCardDocument.fromRequestBody(
        documentDetails,
        CredentialType.digitalVeteranCard
      );

      expect(document).toEqual({
        type: ["VerifiableCredential", "digitalVeteranCard"],
        credentialSubject: {
          name: [
            {
              nameParts: [
                { value: "Ana", type: "GivenName" },
                { value: "Edwards", type: "FamilyName" },
              ],
            },
          ],
          birthDate: [{ value: "-03-06" }],
          veteranCard: [
            {
              expiryDate: "--",
              serviceNumber: "25057386",
              serviceBranch: "HM Naval Service",
              photo: "",
            },
          ],
        },
      });
    });
  });
});
