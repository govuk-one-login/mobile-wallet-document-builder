import { isErrorCode } from "./isErrorCode";

export function getViewCredentialOfferRedirectUrl(
  itemId: string,
  credentialType: string,
  selectedError?: string,
): string {
  let redirectUrl = `/view-credential-offer/${itemId}?type=${credentialType}`;
  if (selectedError && isErrorCode(selectedError)) {
    redirectUrl += `&error=${selectedError}`;
  }
  return redirectUrl;
}
