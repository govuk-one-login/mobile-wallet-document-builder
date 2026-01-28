export interface WalletAppConfig {
  url: string;
  name: string;
}

export type WalletAppsConfig = Record<string, WalletAppConfig>;

export const walletAppsConfig: WalletAppsConfig = {
  "govuk-build": {
    url: "https://mobile.build.account.gov.uk/wallet/",
    name: "GOV.UK App (Build)",
  },
  "govuk-staging": {
    url: "https://mobile.staging.account.gov.uk/wallet/",
    name: "GOV.UK App (Staging)",
  },
  "wallet-test-dev": {
    url: "https://mobile.dev.account.gov.uk/wallet-test/",
    name: "Wallet Test App (Dev)",
  },
  "wallet-test-build": {
    url: "https://mobile.build.account.gov.uk/wallet-test/",
    name: "Wallet Test App (Build)",
  },
  "wallet-test-staging": {
    url: "https://mobile.staging.account.gov.uk/wallet-test/",
    name: "Wallet Test App (Staging)",
  },
  "wallet-test-verifier-integration": {
    url: "https://mobile.integration.account.gov.uk/wallet-test/",
    name: "Wallet Test App (Integration)",
  },
};
