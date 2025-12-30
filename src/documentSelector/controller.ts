import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import { buildTemplateInputForDocuments } from "./utils/buildTemplateInputForDocuments";
import {
  DocumentsConfig,
  documentsConfig as config,
} from "./config/documentsConfig";
import { ExpressRouteFunction } from "../types/ExpressRouteFunction";

export interface DocumentSelectorConfig {
  documentsConfig?: DocumentsConfig;
}

export function documentSelectorGetController({
  documentsConfig = config,
}: DocumentSelectorConfig = {}): ExpressRouteFunction {
  return function (req: Request, res: Response): void {
    try {
      logger.info("test INFO log");
      logger.debug("test DEBUG log");
      logger.warn("test WARN log");
      logger.error("test ERROR log");

      const credentialType = req.query["credentialType"] as string;
      const { route } = documentsConfig[credentialType] ?? {};
      if (route) {
        return res.redirect(route);
      }

      return res.render("select-document-form.njk", {
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
      const selectedDocument = req.body["select-document-choice"];
      if (!selectedDocument) {
        return res.render("select-document-form.njk", {
          error: true,
          documents: buildTemplateInputForDocuments(documentsConfig),
          authenticated: isAuthenticated(req),
        });
      }

      const { route } = documentsConfig[selectedDocument] ?? {};
      if (route) {
        return res.redirect(route);
      }

      return res.render("select-document-form.njk", {
        error: true,
        documents: buildTemplateInputForDocuments(documentsConfig),
        authenticated: isAuthenticated(req),
      });
    } catch (error) {
      logger.error(
        error,
        "An error happened processing request to select document",
      );
      return res.render("500.njk");
    }
  };
}
