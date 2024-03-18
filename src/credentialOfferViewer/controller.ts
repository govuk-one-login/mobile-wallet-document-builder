import { Request, Response } from "express";
import QRCode from "qrcode";
import { getCredentialOffer } from "./services/credentialOfferService";
import { getCustomCredentialOfferUri } from "./helpers/customCredentialOfferUri";

export async function credentialOfferViewerController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const documentId = req.query.documentId as string;
    const selectedApp = req.query.app as string;

    const walletSubjectId = "walletSubjectIdPlaceholder";

    const response = await getCredentialOffer(walletSubjectId, documentId);

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
    console.log(
      `An error happened: ${JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      )}`
    );
    res.render("500.njk");
  }
}
