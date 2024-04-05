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

export interface NinoCredentialSubject extends CredentialSubject {
  socialSecurityRecord?: SocialSecurityRecord[];
}

export interface SocialSecurityRecord {
  personalNumber: string;
}

export interface DbsCredentialSubject extends CredentialSubject {
  birthDate?: BirthDate[];
  address?: Address[];
  issuanceDate?: string;
  expirationDate?: string;
  basicCheckRecord?: BasicCheckRecord[];
}

export interface BasicCheckRecord {
  certificateNumber?: string;
  applicationNumber?: string;
  certificateType: string;
  outcome: string;
  policeRecordsCheck: string;
}

export interface BirthDate {
  value?: string;
}

export interface Address {
  subBuildingName?: string;
  buildingName?: string;
  streetName?: string;
  addressLocality?: string;
  postalCode?: string;
  addressCountry?: string;
}
