import { App } from "../../config/appConfig";

export const stagingApps = (apps: App[]) => {
  const filteredApps = apps.filter((app) => app.environment === "staging");
  return filteredApps.map((app) => ({ text: app.text, value: app.value }));
};

export const nonStagingApps = (apps: App[]) => {
  const filteredApps = apps.filter((app) => app.environment !== "staging");
  return filteredApps.map((app) => ({ text: app.text, value: app.value }));
};
