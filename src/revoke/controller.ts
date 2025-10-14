import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { revokeCredentials } from "./services/revokeService";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";
import { getCriEndpoint } from "../config/appConfig";

export interface RevokeConfig {
  criUrl?: string;
}

export function revokeGetController(): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    res.render("revoke-form.njk");
  };
}

export function revokePostController({
  criUrl = getCriEndpoint(),
}: RevokeConfig = {}): ExpressRouteFunction {
  return async function (req: Request, res: Response): Promise<void> {
    try {
      const documentId = req.body["documentId"];
      if (!validateDocumentId(documentId)) {
        return res.render("revoke-form.njk", {
          error:
            "ID must be 5 to 25 characters long and contain only uppercase or lowercase letters and digits",
          value: documentId,
        });
      }

      const result = await revokeCredentials(criUrl, documentId);

      res.render("revoke-form.njk", {
        message: result.message,
        messageType: result.messageType,
      });
    } catch (error) {
      logger.error(
        error,
        "An error happened trying to revoke the credential(s)",
      );
      res.render("500.njk");
    }
  };
}

function validateDocumentId(documentId: string): boolean {
  const pattern = /^[a-zA-Z0-9]{5,25}$/;
  return pattern.test(documentId);
}
