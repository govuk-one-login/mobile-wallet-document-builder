import { MdlRequestBody } from "../../src/mdlDocumentBuilder/types/MdlRequestBody";

export function buildMdlRequestBody(
  overrides: Partial<MdlRequestBody> = {},
): MdlRequestBody {
  const defaults: MdlRequestBody = {
    family_name: "Edwards-Smith",
    given_name: "Sarah Elizabeth",
    portrait: "420x525.jpg",
    "birth-day": "06",
    "birth-month": "03",
    "birth-year": "1975",
    birth_place: "London",
    "issue-day": "08",
    "issue-month": "04",
    "issue-year": "2019",
    "expiry-day": "08",
    "expiry-month": "04",
    "expiry-year": "2029",
    issuing_authority: "DVLA",
    issuing_country: "United Kingdom (UK)",
    document_number: "25057386",
    resident_address: "Flat 11, Blashford, Adelaide Road",
    resident_postal_code: "NW3 3RX",
    resident_city: "London",
    throwError: "",
  };
  return { ...defaults, ...overrides };
}
