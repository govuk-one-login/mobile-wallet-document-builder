type DeepLinkPaths = Map<string, string>;

const DEEP_LINK_PATHS: DeepLinkPaths = new Map([
  ["govuk-build", "https://mobile.build.account.gov.uk/wallet/"],
  ["govuk-staging", "https://mobile.staging.account.gov.uk/wallet/"],
  ["wallet-test-build", "https://mobile.build.account.gov.uk/wallet-test/"],
  ["wallet-test-staging", "https://mobile.staging.account.gov.uk/wallet-test/"],
]);

const PATTERN_TO_SLICE_ON = "https://mobile.account.gov.uk/wallet/";

function replaceUriPath(credentialOfferUri: string, path: string) {
  const uriParts = credentialOfferUri.split(PATTERN_TO_SLICE_ON);
  const uriWithoutPath = uriParts[1];

  const uriNew = path + uriWithoutPath;
  return uriNew;
}

export function getCustomCredentialOfferUri(
  credentialOfferUri: string,
  selectedApp: string
) {
  const selectedAppPath = DEEP_LINK_PATHS.get(selectedApp);
  if (!selectedAppPath) {
    throw new Error("Path not found");
  }

  return replaceUriPath(credentialOfferUri, selectedAppPath);
}
