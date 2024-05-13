import { CredentialOffer } from "../types/CredentialOfferResponse";

type DeepLinkPaths = Map<string, string>;

const DEEP_LINK_PATHS: DeepLinkPaths = new Map([
  ["govuk-build", "https://mobile.build.account.gov.uk/wallet/"],
  ["govuk-staging", "https://mobile.staging.account.gov.uk/wallet/"],
  ["wallet-test-build", "https://mobile.build.account.gov.uk/wallet-test/"],
  ["wallet-test-staging", "https://mobile.staging.account.gov.uk/wallet-test/"],
]);

const WALLET_URI_PATH_SPLITTER = "https://mobile.account.gov.uk/wallet/";
const CREDENTIAL_OFFER_SPLITTER = "credential_offer=";

function isInvalidUri(uriParts: string[]) {
  return uriParts.length !== 3;
}

function replaceUriPath(credentialOfferUri: string, newPath: string) {
  const uriParts = credentialOfferUri.split(
    new RegExp(`(${WALLET_URI_PATH_SPLITTER})`)
  );
  if (isInvalidUri(uriParts)) {
    throw new Error("Invalid URI");
  }
  return newPath + uriParts[2];
}

function replacePreAuthorizedCodeWithError(
  credentialOfferUri: string,
  errorScenario: string
) {
  const decodedUri = decodeURIComponent(credentialOfferUri);
  const uriParts = decodedUri.split(
    new RegExp(`(${CREDENTIAL_OFFER_SPLITTER})`)
  );
  if (isInvalidUri(uriParts)) {
    throw new Error("Invalid URI");
  }

  const credentialOfferString = uriParts[2];
  const credentialOffer: CredentialOffer = JSON.parse(credentialOfferString);

  // replace credential offer pre-authorized_code with error string
  credentialOffer.grants[
    "urn:ietf:params:oauth:grant-type:pre-authorized_code"
  ]["pre-authorized_code"] = errorScenario;
  const newCredentialOfferEncoded = encodeURIComponent(
    JSON.stringify(credentialOffer)
  );

  return uriParts[0] + uriParts[1] + newCredentialOfferEncoded;
}

export function getCustomCredentialOfferUri(
  credentialOfferUri: string,
  selectedApp: string,
  errorScenario: string
) {
  const selectedAppPath = DEEP_LINK_PATHS.get(selectedApp);
  if (!selectedAppPath) {
    throw new Error("Path not found");
  }

  const newCredentialOfferUri = replaceUriPath(
    credentialOfferUri,
    selectedAppPath
  );

  if (!errorScenario) {
    return newCredentialOfferUri;
  } else {
    return replacePreAuthorizedCodeWithError(
      newCredentialOfferUri,
      errorScenario
    );
  }
}
