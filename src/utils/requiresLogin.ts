import { apps } from "../types/Apps";

export function requiresLogin(selectedApp: string) {
  return apps[selectedApp].login;
}
