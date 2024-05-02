import express from "express";
import { appSelectorRouter } from "./appSelector/router";
import { dbsDocumentBuilderRouter } from "./dbsDocumentBuilder/router";
import { credentialOfferViewerRouter } from "./credentialOfferViewer/router";
import { documentRouter } from "./document/router";
import { stsStubAccessTokenRouter } from "./stsStubAccessToken/router";
import nunjucks from "nunjucks";
import path from "path";
import { stsStubDidDocumentRouter } from "./stsStubDidDocument/router";
import { documentSelectorRouter } from "./documentSelector/router";
import { ninoDocumentBuilderRouter } from "./ninoDocumentBuilder/router";
import { loggerMiddleware } from "./utils/logger";

const APP_VIEWS = [
  path.join(__dirname, "../src/views"),
  path.join(__dirname, "../src/credentialOfferViewer/views"),
  path.join(__dirname, "../src/dbsDocumentBuilder/views"),
  path.join(__dirname, "../src/ninoDocumentBuilder/views"),
  path.join(__dirname, "../src/appSelector/views"),
  path.join(__dirname, "../src/documentSelector/views"),
  path.resolve("node_modules/govuk-frontend/"),
];

export async function createApp(): Promise<express.Application> {
  const app: express.Application = express();

  app.use(express.static(path.join(__dirname, "public")));
  app.use("/public", express.static(path.join(__dirname, "public")));
  app.use(express.static(path.join(__dirname, "assets")));
  app.use("/assets", express.static(path.join(__dirname, "assets")));

  app.set(
    "view engine",
    nunjucks.configure(APP_VIEWS, {
      express: app,
      noCache: true,
    })
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(appSelectorRouter);
  app.use(documentSelectorRouter);
  app.use(dbsDocumentBuilderRouter);
  app.use(ninoDocumentBuilderRouter);
  app.use(credentialOfferViewerRouter);
  app.use(documentRouter);
  app.use(stsStubAccessTokenRouter);
  app.use(stsStubDidDocumentRouter);
  app.use(loggerMiddleware);

  return app;
}
