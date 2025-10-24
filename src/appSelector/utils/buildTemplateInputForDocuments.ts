import { WalletAppsConfig } from "../../config/walletAppsConfig";

export function buildTemplateInputForDocuments(
  walletApps: string[],
  walletAppsConfig: WalletAppsConfig,
) {
  return walletApps.map((app: string) => ({
    text: walletAppsConfig[app].name,
    value: app,
  }));
}
