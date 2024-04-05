export interface NinoFormData {
  title?: string;
  givenName?: string;
  familyName?: string;
  nino?: string;
}

export interface DbsFormData {
  "issuance-day"?: string;
  "issuance-month"?: string;
  "issuance-year"?: string;
  "birth-day"?: string;
  "birth-month"?: string;
  "birth-year"?: string;
  firstName?: string;
  lastName?: string;
  subBuildingName?: string;
  buildingName?: string;
  streetName?: string;
  addressLocality?: string;
  addressCountry?: string;
  postalCode?: string;
  certificateNumber?: string;
  applicationNumber?: string;
}
