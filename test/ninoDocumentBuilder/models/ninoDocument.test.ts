import {
  NinoDocument,
  getSocialSecurityRecord,
} from "../../../src/ninoDocumentBuilder/models/ninoDocument";

describe("ninoDocument.ts", () => {
  it("should return the NINO document in the correct format and without any whitespaces", () => {
    const documentDetails = {
      title: " Ms   ",
      givenName: " Irene  ",
      familyName: " Adler  ",
      nino: " QQ123456A   ",
    };

    const ninoDocument = NinoDocument.fromRequestBody(documentDetails);

    expect(ninoDocument).toEqual({
      credentialSubject: {
        name: [
          {
            nameParts: [
              { type: "Title", value: "Ms" },
              { type: "GivenName", value: "Irene" },
              { type: "FamilyName", value: "Adler" },
            ],
          },
        ],
        socialSecurityRecord: [{ personalNumber: "QQ123456A" }],
      },
      type: ["VerifiableCredential", "SocialSecurityCredential"],
    });
  });

  it("should return the social security record in the correct format", () => {
    const documentDetails = {
      title: "Mrs",
      givenName: "Katie Scarlett",
      familyName: "O'Hara Hamilton",
      nino: "QQ123456A",
    };

    const socialSecurityRecord = getSocialSecurityRecord(documentDetails);

    expect(socialSecurityRecord).toEqual([{ personalNumber: "QQ123456A" }]);
  });

  it("should return an empty array when NINO is missing", () => {
    const documentDetails = {
      title: "Mrs",
      givenName: "Katie Scarlett",
      familyName: "O'Hara Hamilton",
      nino: "",
    };

    const socialSecurityRecord = getSocialSecurityRecord(documentDetails);

    expect(socialSecurityRecord).toEqual([]);
  });
});
