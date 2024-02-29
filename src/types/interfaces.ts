export interface LocalStackAwsConfig {
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  region: string;
}

export interface DocumentDetails {
  title?: string;
  givenName?: string;
  familyName?: string;
  nino?: string;
}

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
