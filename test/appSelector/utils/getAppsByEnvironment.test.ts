import { getAppDisplayOptions } from "../../../src/appSelector/utils/getAppDisplayOptions";
import { WalletAppsConfig } from "../../../src/config/walletAppsConfig";

describe("getAppDisplayOptions", () => {
  const walletAppsConfig: WalletAppsConfig = {
    "test-app-1": {
      url: "https://test-one.com/wallet/",
      name: "Test App (1)",
    },
    "test-app-2": {
      url: "https://test-two.com/wallet/",
      name: "Test App (2)",
    },
    "test-app-3": {
      url: "https://test-three.com/wallet/",
      name: "Test App (3)",
    },
  };

  it("should map wallet apps to display options correctly", () => {
    const walletApps = ["test-app-1", "test-app-3"];
    const result = getAppDisplayOptions(walletApps, walletAppsConfig);

    expect(result).toEqual([
      { text: "Test App (1)", value: "test-app-1" },
      { text: "Test App (3)", value: "test-app-3" },
    ]);
  });

  it("should throw an error if a wallet app does not exist in config", () => {
    const walletApps = ["unknown", "test-app-1"];
    expect(() => getAppDisplayOptions(walletApps, walletAppsConfig)).toThrow();
  });
});
