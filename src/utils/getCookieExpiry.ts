import { getCookieTtlInSecs } from "../config/appConfig";

export function getCookieExpiry() {
  return Number(getCookieTtlInSecs()) * 1000;
}
