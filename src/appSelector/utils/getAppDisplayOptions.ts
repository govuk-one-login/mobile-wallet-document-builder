import { WalletAppsConfig } from "../../config/walletAppsConfig";

export function getAppDisplayOptions(
  walletApps: string[],
  walletAppsConfig: WalletAppsConfig,
) {
  return walletApps.map((app: string) => ({
    text: walletAppsConfig[app].name,
    value: app,
  }));
}
