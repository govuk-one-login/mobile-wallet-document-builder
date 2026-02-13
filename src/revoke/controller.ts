import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { revoke } from "./services/revokeService";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";
import { getCriEndpoint } from "../config/appConfig";
import { formatValidationError, renderBadRequest } from "../utils/validation";

const REVOKE_TEMPLATE = "revoke-form.njk";

export interface RevokeConfig {
  criUrl?: string;
}

/**
 * Controller to handle GET requests for the revoke document page.
 *
 * @returns An Express route function that renders the revoke form.
 */
export function revokeGetController(): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    res.render("revoke-form.njk");
  };
}

/**
 * Controller to handle POST requests for revoking a document.
 *
 * @param config - Configuration object containing the CRI URL.
 * @returns An Express route function that processes the revocation request.
 */
export function revokePostController({
  criUrl = getCriEndpoint(),
}: RevokeConfig = {}): ExpressRouteFunction {
  return async function (req: Request, res: Response): Promise<void> {
    try {
      const documentId = req.body["documentId"];
      if (!validateDocumentId(documentId)) {
        return renderBadRequest(
          res,
          req,
          REVOKE_TEMPLATE,
          formatValidationError(
            "documentId",
            "ID must be 5 to 25 characters long and contain only uppercase or lowercase letters and digits",
          ),
        );
      }

      const result = await revoke(criUrl, documentId);

      if (result === 404) {
        return renderBadRequest(
          res,
          req,
          REVOKE_TEMPLATE,
          formatValidationError(
            "documentId",
            "No digital driving licence found with this licence number",
          ),
        );
      }

      if (result === 202) {
        return res.render(REVOKE_TEMPLATE, {
          message: "Digital driving licence successfully revoked",
          messageType: "success",
        });
      }

      res.render(REVOKE_TEMPLATE, {
        message:
          "Something went wrong and the credential(s) may not have been revoked",
        messageType: "error",
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
