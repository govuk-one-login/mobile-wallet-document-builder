import { Request, Response } from "express";
import QRCode from "qrcode";
import { getCredentialOfferUrl } from "./services/credentialOfferService";
import { customiseCredentialOfferUrl } from "./helpers/customCredentialOfferUrl";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { apps, getEnvironment } from "../config/appConfig";

export async function credentialOfferViewerController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { itemId } = req.params;
    const selectedApp = req.cookies.app as string;
    const credentialType = req.query.type as string;
    const errorScenario = req.query.error as string;
    const walletSubjectId = req.cookies.wallet_subject_id as string;

    const credentialOfferUrl = await getCredentialOfferUrl(
      walletSubjectId,
      itemId,
      credentialType,
    );

    const customisedCredentialOfferUrl = customiseCredentialOfferUrl(
      credentialOfferUrl,
      selectedApp,
      apps,
      errorScenario,
    );

    const qrCode = await QRCode.toDataURL(customisedCredentialOfferUrl);

    res.render("credential-offer.njk", {
      authenticated: isAuthenticated(req),
      universalLink: customisedCredentialOfferUrl,
      qrCode,
      environment: getEnvironment(),
    });
  } catch (error) {
    logger.error(
      error,
      "An error happened processing credential offer request",
    );
    res.render("500.njk");
  }
}
