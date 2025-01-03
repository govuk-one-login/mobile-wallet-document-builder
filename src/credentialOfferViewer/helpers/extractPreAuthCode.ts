import { CredentialOfferResponse } from "../types/CredentialOfferResponse";

export function extractPreAuthCode(
  credentialOfferResponse: CredentialOfferResponse
): string {
  const urlParams = new URL(credentialOfferResponse["credential_offer_uri"])
    .searchParams;
  const credentialOffer = JSON.parse(urlParams.get("credential_offer")!);
  return credentialOffer["grants"][
    "urn:ietf:params:oauth:grant-type:pre-authorized_code"
  ]["pre-authorized_code"];
}
