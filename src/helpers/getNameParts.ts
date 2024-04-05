import { NamePart } from "../types/CredentialSubject";

export function getNameParts(
  name: string | undefined,
  surname: string | undefined,
  title?: string | undefined
) {
  const nameParts: NamePart[] = [];
  if (title) {
    nameParts.push({
      value: title,
      type: "Title",
    });
  }

  if (name) {
    const givenNames = name.split(" ");
    for (const name of givenNames) {
      nameParts.push({
        value: name,
        type: "GivenName",
      });
    }
  }

  if (surname) {
    const familyNames = surname.split(" ");
    for (const surname of familyNames) {
      nameParts.push({
        value: surname,
        type: "FamilyName",
      });
    }
  }

  return nameParts;
}
