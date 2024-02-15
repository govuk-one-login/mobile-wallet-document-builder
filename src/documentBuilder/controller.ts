import { Request, Response } from "express";
import QRCode from "qrcode";

export async function documentBuilderGet(
  req: Request,
  res: Response
): Promise<void> {
  res.render("test.njk");
}

export async function documentBuilderPost(
  req: Request,
  res: Response
): Promise<void> {
  
  // save document data to DynamoDB

  // axios GET request to Credential Issuer
  const deepLinkWithCredentialOffer = "test";

  const qrCode = await QRCode.toDataURL(deepLinkWithCredentialOffer);

  res.render("test.njk", {
    deepLink: deepLinkWithCredentialOffer,
    qrCode,
  });
}
