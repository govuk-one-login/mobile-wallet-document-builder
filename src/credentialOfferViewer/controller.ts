import { Request, Response } from "express";
import QRCode from "qrcode";
import { getCredentialOffer } from "./services/credentialOfferService";
import { getCustomCredentialOfferUri } from "./helpers/customCredentialOfferUri";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { UserInfo } from "./types/UserInfo";
import { apps, getSelfUrl } from "../config/appConfig";
import axios from "axios";
import { GrantType } from "../stsStubAccessToken/token/validateTokenRequest";

export async function credentialOfferViewerController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { documentId } = req.params;
    const selectedApp = req.cookies.app as string;
    const credentialType = req.query.type as string;
    const errorScenario = req.query.error as string;

    const userInfo: UserInfo = await req.oidc.userinfo(
      req.cookies.access_token,
      { method: "GET", via: "header" }
    );
    const walletSubjectId = userInfo.wallet_subject_id;

    const credentialOfferResponse = await getCredentialOffer(
      walletSubjectId,
      documentId,
      credentialType
    );

    const credentialOfferUri = getCustomCredentialOfferUri(
      credentialOfferResponse["credential_offer_uri"],
      selectedApp,
      apps,
      errorScenario
    );

    const qrCode = await QRCode.toDataURL(credentialOfferUri);

    const urlParams = (new URL(credentialOfferResponse["credential_offer_uri"])).searchParams
    const credentialOffer = JSON.parse(urlParams.get("credential_offer")!)
    const preAuthorizedCode = credentialOffer["grants"]["urn:ietf:params:oauth:grant-type:pre-authorized_code"]["pre-authorized_code"]

    const tokenResponse= await axios.post(`${getSelfUrl()}/token`, {
      "grant_type": GrantType.PREAUTHORIZED_CODE,
      "pre-authorized_code": preAuthorizedCode,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })

    logger.debug("Token Response", {tokenResponse})

    res.render("credential-offer.njk", {
      authenticated: isAuthenticated(req),
      universalLink: credentialOfferUri,
      preAuthorizedCode,
      qrCode,
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened processing credential offer request"
    );
    res.render("500.njk");
  }
}
