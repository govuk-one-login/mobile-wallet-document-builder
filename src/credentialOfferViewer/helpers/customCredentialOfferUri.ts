type DeepLinkPaths = Map<string, string>;

const DEEP_LINK_PATHS: DeepLinkPaths = new Map([
  ["sts-build", "https://mobile.build.account.gov.uk/wallet/"],
  ["sts-staging", "https://mobile.staging.account.gov.uk/wallet/"],
  ["test-build", "https://mobile.build.account.gov.uk/wallet-test/"],
  ["test-staging", "https://mobile.staging.account.gov.uk/wallet-test/"],
]);

const URI_STRING_VALUE_TO_SLICE_ON = "add?";

function replaceUriPath(credentialOfferUri: string, path: string) {
  const indexToSliceFrom = credentialOfferUri.indexOf(
    URI_STRING_VALUE_TO_SLICE_ON
  );
  const credentialOfferUriWithoutPath =
    credentialOfferUri.slice(indexToSliceFrom);

  const credentialOfferUriNew = path + credentialOfferUriWithoutPath;
  return credentialOfferUriNew;
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
