import { getNameParts } from "../../src/utils/getNameParts";

describe("getNameParts.ts", () => {
  it("should return the name parts in the correct format [multiple names]", () => {
    const nameParts = getNameParts("Katie Scarlett", "O'Hara Hamilton", "Mrs");

    expect(nameParts).toEqual([
      { type: "Title", value: "Mrs" },
      { type: "GivenName", value: "Katie" },
      { type: "GivenName", value: "Scarlett" },
      { type: "FamilyName", value: "O'Hara" },
      { type: "FamilyName", value: "Hamilton" },
    ]);
  });

  it("should return the name parts in the correct format [missing title]", () => {
    const nameParts = getNameParts("Irene", "Adler", "");

    expect(nameParts).toEqual([
      { type: "GivenName", value: "Irene" },
      { type: "FamilyName", value: "Adler" },
    ]);
  });

  it("should return the name parts in the correct format [missing given name]", () => {
    const nameParts = getNameParts("", "Adler", "Ms");

    expect(nameParts).toEqual([
      { type: "Title", value: "Ms" },
      { type: "FamilyName", value: "Adler" },
    ]);
  });

  it("should return the name parts without a title", () => {
    const nameParts = getNameParts("Irene", "Adler");

    expect(nameParts).toEqual([
      { type: "GivenName", value: "Irene" },
      { type: "FamilyName", value: "Adler" },
    ]);
  });

  it("should return an empty array if all values are falsy", () => {
    const nameParts = getNameParts("", "", "");

    expect(nameParts).toEqual([]);
  });
});
