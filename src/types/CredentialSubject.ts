export interface CredentialSubject {
  name: Name[];
  socialSecurityRecord: SocialSecurityRecord[];
}

export interface Name {
  nameParts: NamePart[];
}

export interface NamePart {
  value: string;
  type: string;
}

export interface SocialSecurityRecord {
  personalNumber: string;
}
