import { Request, Response } from "express";
import QRCode from "qrcode";

export async function documentBuilder(
  req: Request,
  res: Response
): Promise<void> {
  const deepLinkWithCredentialOffer = "test"; // axios GET request to Credential Issuer
  const qrCode = await QRCode.toDataURL(deepLinkWithCredentialOffer);

  res.render("test.njk", {
    deepLink: deepLinkWithCredentialOffer,
    qrCode,
  });
}
