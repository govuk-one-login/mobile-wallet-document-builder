import { Request, Response } from "express";
import { isAuthenticated } from "../utils/isAuthenticated";
import { logger } from "../middleware/logger";

export async function refreshGetController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { credentialType } = req.params;
    res.render("refresh-form.njk", {
      authenticated: isAuthenticated(req),
      credentialType: { credentialType },
    });
  } catch (error) {
    logger.error(error, "An error happened rendering Refresh Credential page");
    res.render("500.njk");
  }
}
