export interface DrivingLicenceRequestBody {
    familyName: string;
    givenName: string;
    portrait: string;
    "birthDate-day": string;
    "birthDate-month": string;
    "birthDate-year": string;
    birthPlace: string;
    "issueDate-day": string;
    "issueDate-month": string;
    "issueDate-year": string;
    "expiryDate-day": string;
    "expiryDate-month": string;
    "expiryDate-year": string;
    issuingAuthority: string;
    issuingCountry: string;
    documentNumber: string;
    residentAddress: string;
    residentPostalCode: string;
    residentCity: string;
    throwError: string;
}