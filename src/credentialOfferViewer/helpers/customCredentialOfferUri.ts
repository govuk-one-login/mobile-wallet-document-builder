type DeepLinkPaths = Map<string, string>;

const DEEP_LINK_PATHS: DeepLinkPaths = new Map([
    ["sts-build", "https://N8W395F695.uk.gov.one-login.build/wallet/"],
    ["sts-staging", "https://N8W395F695.uk.gov.one-login.staging/wallet/"],
    ["test-build", "https://mobile.build.account.gov.uk/test-wallet/"],
    ["test-staging", "https://mobile.staging.account.gov.uk/test-wallet/"],
]);

const URI_STRING_VALUE_TO_SLICE_ON = 'add?';

function replaceUriPath(credentialOfferUri: string, path: string) {
    const indexToSliceFrom = credentialOfferUri.indexOf(URI_STRING_VALUE_TO_SLICE_ON);
    const credentialOfferUriWithoutPath = credentialOfferUri.slice(indexToSliceFrom)

    const credentialOfferUriNew = path + credentialOfferUriWithoutPath;
    return credentialOfferUriNew;
}

export function getCustomCredentialOfferUri(credentialOfferUri: string, selectedApp: string) {
    const selectedAppPath = DEEP_LINK_PATHS.get(selectedApp);
    console.log('selectedAppPath', selectedAppPath)
    if (!selectedAppPath) {
        throw new Error('Path not found')
    }

    return replaceUriPath(credentialOfferUri, selectedAppPath);
}