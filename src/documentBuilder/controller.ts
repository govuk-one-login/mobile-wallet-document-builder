import { Request, Response } from "express";
import QRCode from "qrcode";
import { Document } from "./documentBuilder";
import { saveDocument } from "./documentStore";
import { randomUUID } from "node:crypto";

export async function documentBuilderGet(
  req: Request,
  res: Response
): Promise<void> {
  console.log("documentBuilderGet");
  res.render("document-form.njk");
}

export async function documentBuilderPost(
  req: Request,
  res: Response
): Promise<void> {
  console.log("documentBuilderPost");

  const document = Document.fromRequestBody(req.body);
  console.log("Document created");

  const documentId = randomUUID();
  await saveDocument(document, documentId);

  // axios GET request to Credential Issuer
  const deepLinkWithCredentialOffer = "test";

  const qrCode = await QRCode.toDataURL(deepLinkWithCredentialOffer);

  res.render("document-id.njk", {
    documentId,
    deepLink: deepLinkWithCredentialOffer, // not yet in use
    qrCode, // not yet in use
  });
}
