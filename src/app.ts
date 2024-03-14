import express from "express";
import { documentBuilderRouter } from "./documentBuilder/router";
import { credentialOfferViewerRouter } from "./credentialOfferViewer/router";
import { documentDataRouter } from "./documentData/router";

import nunjucks from "nunjucks";
import path from "path";

const APP_VIEWS = [
  path.join(__dirname, "../src/views"),
  path.join(__dirname, "../src/credentialOfferViewer/views"),
  path.join(__dirname, "../src/documentBuilder/views"),
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
  app.use(documentBuilderRouter);
  app.use(credentialOfferViewerRouter);
  app.use(documentDataRouter);

  return app;
}
