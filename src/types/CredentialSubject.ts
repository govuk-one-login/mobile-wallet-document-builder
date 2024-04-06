export interface CredentialSubject {
  name: Name[];
}

export interface Name {
  nameParts: NamePart[];
}

export interface NamePart {
  value: string;
  type: string;
}