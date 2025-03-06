import { Request, Response } from "express";
import QRCode from "qrcode";
import { getCredentialOfferUrl } from "./services/credentialOfferService";
import { getCustomCredentialOfferUrl } from "./helpers/customCredentialOfferUrl";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { UserInfo } from "./types/UserInfo";
import { apps } from "../config/appConfig";

export async function credentialOfferViewerController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { documentId } = req.params;
    const selectedApp = req.cookies.app as string;
    const credentialType = req.query.type as string;
    const errorScenario = req.query.error as string;

    const userInfo: UserInfo = await req.oidc.userinfo(
      req.cookies.access_token,
      { method: "GET", via: "header" },
    );
    const walletSubjectId = userInfo.wallet_subject_id;

    let credentialOfferUrl = await getCredentialOfferUrl(
      walletSubjectId,
      documentId,
      credentialType,
    );

    credentialOfferUrl = getCustomCredentialOfferUrl(
      credentialOfferUrl,
      selectedApp,
      apps,
      errorScenario,
    );

    const qrCode = await QRCode.toDataURL(credentialOfferUrl);

    res.render("credential-offer.njk", {
      authenticated: isAuthenticated(req),
      universalLink: credentialOfferUrl,
      qrCode,
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened processing credential offer request",
    );
    res.render("500.njk");
  }
}
