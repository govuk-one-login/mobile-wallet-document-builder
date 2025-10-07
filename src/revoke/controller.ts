import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { revokeCredentials } from "./services/revokeService";

export async function revokeGetController(
  req: Request,
  res: Response,
): Promise<void> {
  res.render("revoke-form.njk");
}

export async function revokePostController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const drivingLicenceNumber = req.body["driving-licence-number"];

    const result = await revokeCredentials(drivingLicenceNumber);

    res.render("revoke-form.njk", {
      message: result.message,
      messageType: result.messageType,
    });
  } catch (error) {
    logger.error(error, "An error happened trying to revoke the credential(s)");
    res.render("500.njk");
  }
}
