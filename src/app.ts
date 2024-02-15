import express from "express";
import { documentBuilderRouter } from "./documentBuilder/router";
import { documentDataRouter } from "./documentData/router";

import nunjucks from "nunjucks";
import path from "path";
import cookieParser from "cookie-parser";

const APP_VIEWS = [
  path.join(__dirname, "../src/views"),
  path.resolve("node_modules/govuk-frontend/"),
];

export async function createApp(): Promise<express.Application> {
  const app: express.Application = express();

  app.use(cookieParser());

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

  app.use(express.urlencoded({ extended: true })); // support encoded bodies
  app.use(documentBuilderRouter);
  app.use(documentDataRouter);

  return app;
}
