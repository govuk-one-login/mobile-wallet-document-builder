import { Request, Response } from "express";
import QRCode from "qrcode";
import { getCredentialOffer } from "./services/credentialOfferService";
import { getCustomCredentialOfferUri } from "./helpers/customCredentialOfferUri";
import { logger } from "../utils/logger";

export async function credentialOfferViewerController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { documentId } = req.params;
    const selectedApp = req.query.app as string;
    const credentialType = req.query.type as string;

    const walletSubjectId = "walletSubjectIdPlaceholder";

    const response = await getCredentialOffer(
      walletSubjectId,
      documentId,
      credentialType
    );

    const credentialOfferUri = getCustomCredentialOfferUri(
      response["credential_offer_uri"],
      selectedApp
    );
    const qrCode = await QRCode.toDataURL(credentialOfferUri);

    res.render("credential-offer.njk", {
      universalLink: credentialOfferUri,
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
