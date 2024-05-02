import { CredentialSubject } from "../../types/CredentialSubject";

export interface NinoCredentialSubject extends CredentialSubject {
  socialSecurityRecord?: SocialSecurityRecord[];
}

export interface SocialSecurityRecord {
  personalNumber: string;
}
