import { Request, Response } from "express";
import QRCode from "qrcode";
import { getCredentialOffer } from "./services/credentialOfferService";
import { getCustomCredentialOfferUri } from "./helpers/customCredentialOfferUri";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { UserInfo } from "./types/UserInfo";
import { apps } from "../config/appConfig";
import { decodeJwt } from "jose";
import { getCredential } from "./services/credentialService";
import { extractPreAuthCode } from "./helpers/extractPreAuthCode";
import { getAccessToken } from "./services/accessTokenService";
import { getProofJwt } from "./services/proofJwtService";

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

    const preAuthorizedCode = extractPreAuthCode(credentialOfferResponse);

    const accessToken = await getAccessToken(preAuthorizedCode);

    const tokenClaims = decodeJwt(accessToken);

    const proofJwt = await getProofJwt(
      tokenClaims.c_nonce as string,
      tokenClaims.aud as string
    );

    const credential = await getCredential(accessToken, proofJwt);

    const credentialClaims = decodeJwt(credential);

    res.render("credential-offer.njk", {
      authenticated: isAuthenticated(req),
      universalLink: credentialOfferUri,
      preAuthorizedCode,
      qrCode,
      credential,
      credentialClaims: JSON.stringify(credentialClaims),
      accessToken,
      tokenClaims: JSON.stringify(tokenClaims),
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened processing credential offer request"
    );
    res.render("500.njk");
  }
}
