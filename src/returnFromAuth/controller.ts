import { Request, Response } from "express";
import { logger } from "../utils/logger";
import {CallbackParamsType} from "openid-client";

export async function returnFromAuthGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("returnFromAuthGetController");
    const queryParams: CallbackParamsType = req.oidc.callbackParams(req);
    if (queryParams.error === "access_denied") {
      res.status(403);
    } else if (queryParams.error) {
      // DO WE CHECK FOR OTHER SPECIFIC ERRORS?
      res.status(500);
    }

    // https://stub-credential-issuer.mobile.build.account.gov.uk/return-from-auth?
    // code=GPDZtk4BCUf5vzm3F1gulswenpsaqvRy2eoAMKMMUww
    // &state=41r4dalry7HgTG8uSF_OeJnqzWKgZD38C8eFV-79IS8

  } catch (error) {
    logger.error(error, "An error happened returning from auth");
    res.render("500.njk");
  }
}
