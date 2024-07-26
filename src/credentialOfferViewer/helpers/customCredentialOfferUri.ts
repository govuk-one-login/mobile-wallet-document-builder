import { CredentialOffer } from "../types/CredentialOfferResponse";
import { App } from "../../config/appConfig";

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
  allApps: App[],
  errorScenario: string
) {
  const app = allApps.filter((app) => app.value === selectedApp);
  const appPath = app[0].path;

  const newCredentialOfferUri = replaceUriPath(credentialOfferUri, appPath);

  if (!errorScenario) {
    return newCredentialOfferUri;
  } else {
    return replacePreAuthorizedCodeWithError(
      newCredentialOfferUri,
      errorScenario
    );
  }
}
