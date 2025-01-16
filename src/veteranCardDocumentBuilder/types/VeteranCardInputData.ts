export interface VeteranCardInputData {
  givenName: string;
  familyName: string;
  "dateOfBirth-day": string;
  "dateOfBirth-month": string;
  "dateOfBirth-year": string;
  "cardExpiryDate-day": string;
  "cardExpiryDate-month": string;
  "cardExpiryDate-year": string;
  "serviceStartDate-day": string;
  "serviceStartDate-month": string;
  "serviceStartDate-year": string;
  "serviceEndDate-day": string;
  "serviceEndDate-month": string;
  "serviceEndDate-year": string;
  serviceNumber: string;
  serviceBranch: string;
  throwError: string;
}
