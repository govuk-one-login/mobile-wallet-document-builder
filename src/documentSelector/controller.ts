import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { buildTemplateInputForDocuments } from "./utils/buildTemplateInputForDocuments";
import {
  DocumentsConfig,
  documentsConfig as config,
} from "./config/documentsConfig";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";
import { formatValidationError, renderBadRequest } from "../utils/validation";

const SELECT_DOCUMENT_TEMPLATE = "select-document-form.njk";

export interface DocumentSelectorConfig {
  documentsConfig?: DocumentsConfig;
}

export function documentSelectorGetController({
  documentsConfig = config,
}: DocumentSelectorConfig = {}): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      const credentialType = req.query["credentialType"] as string;
      const { route } = documentsConfig[credentialType] ?? {};
      if (route) {
        return res.redirect(route);
      }

      return res.render(SELECT_DOCUMENT_TEMPLATE, {
        documents: buildTemplateInputForDocuments(documentsConfig),
        authenticated: isAuthenticated(req),
      });
    } catch (error) {
      logger.error(
        error,
        "An error happened rendering document selection page",
      );
      return res.render("500.njk");
    }
  };
}

export function documentSelectorPostController({
  documentsConfig = config,
}: DocumentSelectorConfig = {}): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      const selectedDocument = req.body["document"];
      if (!selectedDocument || !documentsConfig[selectedDocument]) {
        return renderBadRequest(
          res,
          req,
          SELECT_DOCUMENT_TEMPLATE,
          formatValidationError(
            "document",
            "Select the document you want to create",
          ),
          {
            documents: buildTemplateInputForDocuments(documentsConfig),
            authenticated: isAuthenticated(req),
          },
        );
      }

      const { route } = documentsConfig[selectedDocument];
      return res.redirect(route);
    } catch (error) {
      logger.error(
        error,
        "An error happened processing request to select document",
      );
      return res.render("500.njk");
    }
  };
}
