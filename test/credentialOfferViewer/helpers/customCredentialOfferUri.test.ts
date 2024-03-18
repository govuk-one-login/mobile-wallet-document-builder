import { getCustomCredentialOfferUri } from "../../../src/credentialOfferViewer/helpers/customCredentialOfferUri";

describe("customCredentialOfferUri.ts", () => {
  it("should return the URI for the STS app in build", async () => {
    const credentialOfferUri =
      "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer";
    const selectedApp = "sts-build";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp
    );

    expect(response).toEqual(
      "https://N8W395F695.uk.gov.one-login.build/wallet/add?credential_offer=testCredentialOffer"
    );
  });

  it("should return the URI for the STS app in staging", async () => {
    const credentialOfferUri =
      "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer";
    const selectedApp = "sts-staging";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp
    );

    expect(response).toEqual(
      "https://N8W395F695.uk.gov.one-login.staging/wallet/add?credential_offer=testCredentialOffer"
    );
  });

  it("should return the URI for the Test app in build", async () => {
    const credentialOfferUri =
      "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer";
    const selectedApp = "test-build";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp
    );

    expect(response).toEqual(
      "https://mobile.build.account.gov.uk/test-wallet/add?credential_offer=testCredentialOffer"
    );
  });

  it("should return the URI for the Test app in staging", async () => {
    const credentialOfferUri =
      "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer";
    const selectedApp = "test-staging";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp
    );

    expect(response).toEqual(
      "https://mobile.staging.account.gov.uk/test-wallet/add?credential_offer=testCredentialOffer"
    );
  });

  it("should throw an error if there is no path for the selected app", async () => {
    const credentialOfferUri =
      "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer";
    const selectedApp = "unknownOption";

    expect(() => {
      getCustomCredentialOfferUri(credentialOfferUri, selectedApp);
    }).toThrow("Path not found");
  });
});
