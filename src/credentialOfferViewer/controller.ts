import { Request, Response } from "express";
import QRCode from "qrcode";
import { getCredentialOffer } from "./services/credentialOfferService";

export async function viewCredentialOffer(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { documentId } = req.params;
    const walletSubjectId = "walletSubjectIdPlaceholder";

    const response = await getCredentialOffer(walletSubjectId, documentId);
    const credentialOfferUri = response["credential_offer_uri"];
    const qrCode = await QRCode.toDataURL(credentialOfferUri);

    res.render("credential-offer.njk", {
      universalLink: credentialOfferUri,
      qrCode,
    });
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    res.render("500.njk");
  }
}
