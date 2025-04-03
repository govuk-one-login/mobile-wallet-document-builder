import {CredentialSubject} from "../../types/CredentialSubject";
import {BirthDate} from "../../types/BirthDate";

export interface MdlCredentialSubject extends CredentialSubject {
    birthDate: BirthDate[];
    birthPlace: string;
    residentAddress: Address[];
    residentPostalCode: string;
    residentCity: string;
    issueDate: string;
    expiryDate: string;
    drivingLicence: DrivingLicence[];
}

export interface DrivingLicence {
    issuingAuthority: string;
    issuingCountry: string;
    documentNumber: string;
    portrait: string;
}

export interface Address {
    subBuildingName?: string;
    buildingName?: string;
    streetName?: string;
}