export interface LocalStackAwsConfig {
  endpoint: string;
  credentials: Credentials;
  region: string;
}

export interface Credentials {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface FormData {
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

export interface CredentialOfferResponse {
  credential_offer_uri: string;
}
