import { App, APPS } from "../../config/appConfig";

export function getAppsByEnvironment(environment: string) {
  const filteredApps = APPS.filter((app) =>
    environment === "staging"
      ? app.environment === "staging"
      : app.environment !== "staging",
  );
  return filteredApps.map((app: App) => ({ text: app.text, value: app.value }));
}
