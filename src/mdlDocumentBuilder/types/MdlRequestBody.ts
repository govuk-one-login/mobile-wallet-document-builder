export interface MdlRequestBody {
  family_name: string;
  given_name: string;
  portrait: string;
  "birth-day": string;
  "birth-month": string;
  "birth-year": string;
  birth_place: string;
  "issue-day": string;
  "issue-month": string;
  "issue-year": string;
  "expiry-day": string;
  "expiry-month": string;
  "expiry-year": string;
  issuing_authority: string;
  issuing_country: string;
  document_number: string;
  resident_address: string;
  resident_postal_code: string;
  resident_city: string;
  throwError: string;
}
