import { Request, Response } from "express";
import { Document } from "./documentBuilder";
import { saveDocument } from "./documentStore";
import { randomUUID } from "node:crypto";
import QRCode from "qrcode";
import { getCredentialOffer } from "./credentialOffer";

export async function documentBuilderGet(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("documentBuilderGet");
    res.render("document-form.njk");
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    res.render("500.njk");
  }
}

export async function documentBuilderPost(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("documentBuilderPost");
    const document = Document.fromRequestBody(req.body);
    const walletSubjectId = "walletSubjectIdPlaceholder";
    const documentId = randomUUID();
    await saveDocument(document, documentId, walletSubjectId);

    const response = await getCredentialOffer(walletSubjectId, documentId);
    const credentialOfferUri = response["credential_offer_uri"];
    const qrCode = await QRCode.toDataURL(credentialOfferUri);

    res.render("credential-offer.njk", {
      universalLink: credentialOfferUri,
      qrCode,
      documentId, // Included for testing purposes only
    });
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    res.render("500.njk");
  }
}
