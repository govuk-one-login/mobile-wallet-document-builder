import { CredentialSubject } from "../../types/CredentialSubject";
import { BirthDate } from "../../types/BirthDate";

export interface VeteranCredentialSubject extends CredentialSubject {
  birthDate: BirthDate[];
  veteranCard: VeteranCard[];
}

export interface VeteranCard {
  expiryDate: string;
  serviceNumber: string;
  serviceBranch: string;
  photo: string;
}
