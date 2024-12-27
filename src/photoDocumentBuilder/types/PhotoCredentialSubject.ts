import { CredentialSubject } from "../../types/CredentialSubject";

export interface PhotoCredentialSubject extends CredentialSubject {
  photo: string;
}
