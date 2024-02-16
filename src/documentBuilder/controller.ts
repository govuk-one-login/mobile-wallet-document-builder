import { Request, Response } from "express";
import QRCode from "qrcode";

export async function documentBuilderGet(
  req: Request,
  res: Response
): Promise<void> {
  console.log("documentBuilderGet");
  res.render("hello.njk");
}

export async function documentBuilderPost(
  req: Request,
  res: Response
): Promise<void> {
  console.log("documentBuilderPost");

  // save document data to DynamoDB

  // axios GET request to Credential Issuer
  const deepLinkWithCredentialOffer = "test";

  const qrCode = await QRCode.toDataURL(deepLinkWithCredentialOffer);

  res.render("hello.njk", {
    deepLink: deepLinkWithCredentialOffer,
    qrCode,
  });
}
