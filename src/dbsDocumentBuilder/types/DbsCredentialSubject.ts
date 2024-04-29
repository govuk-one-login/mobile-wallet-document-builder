import {CredentialSubject} from "../../types/CredentialSubject";

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
