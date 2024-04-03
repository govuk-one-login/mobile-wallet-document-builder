import {
  Document,
  getNameParts,
  getSocialSecurityRecord,
} from "../../../src/dbsDocumentBuilder/models/documentBuilder";

describe("documentBuilder.ts", () => {
  describe("Document", () => {
    it("should return the document in the correct format and without any whitespaces", () => {
      const documentDetails = {
        title: " Ms   ",
        givenName: " Irene  ",
        familyName: " Adler  ",
        nino: " QQ123456A   ",
      };

      const document = Document.fromRequestBody(documentDetails);

      expect(document).toEqual({
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
      } as Document);
    });
  });

  describe("getNameParts", () => {
    it("should return the name parts in the correct format [multiple names]", () => {
      const documentDetails = {
        title: "Mrs",
        givenName: "Katie Scarlett",
        familyName: "O'Hara Hamilton",
        nino: "QQ123456A",
      };

      const nameParts = getNameParts(documentDetails);

      expect(nameParts).toEqual([
        { type: "Title", value: "Mrs" },
        { type: "GivenName", value: "Katie" },
        { type: "GivenName", value: "Scarlett" },
        { type: "FamilyName", value: "O'Hara" },
        { type: "FamilyName", value: "Hamilton" },
      ]);
    });

    it("should return the name parts in the correct format [missing title]", () => {
      const documentDetails = {
        title: "",
        givenName: "Irene",
        familyName: "Adler",
        nino: "QQ123456A",
      };

      const nameParts = getNameParts(documentDetails);

      expect(nameParts).toEqual([
        { type: "GivenName", value: "Irene" },
        { type: "FamilyName", value: "Adler" },
      ]);
    });

    it("should return the name parts in the correct format [missing given name]", () => {
      const documentDetails = {
        title: "Ms",
        givenName: "",
        familyName: "Adler",
        nino: "QQ123456A",
      };

      const nameParts = getNameParts(documentDetails);

      expect(nameParts).toEqual([
        { type: "Title", value: "Ms" },
        { type: "FamilyName", value: "Adler" },
      ]);
    });
  });

  describe("getSocialSecurityRecord", () => {
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
});
