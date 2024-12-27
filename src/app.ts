import express from "express";
import { appSelectorRouter } from "./appSelector/router";
import { dbsDocumentBuilderRouter } from "./dbsDocumentBuilder/router";
import { credentialOfferViewerRouter } from "./credentialOfferViewer/router";
import { documentRouter } from "./document/router";
import { stsStubAccessTokenRouter } from "./stsStubAccessToken/router";
import nunjucks from "nunjucks";
import path from "path";
import { stsStubJwksRouter } from "./stsStubJwks/router";
import { documentSelectorRouter } from "./documentSelector/router";
import { ninoDocumentBuilderRouter } from "./ninoDocumentBuilder/router";
import { loggerMiddleware } from "./middleware/logger";
import { getOIDCConfig } from "./config/oidc";
import { auth } from "./middleware/auth";
import cookieParser from "cookie-parser";
import { returnFromAuthRouter } from "./returnFromAuth/router";
import { logoutRouter } from "./logout/router";
import { loggedOutRouter } from "./loggedOut/router";
import { noCacheMiddleware } from "./middleware/noCache";
import { proofJwtRouter } from "./proofJwt/router";
import { photoDocumentBuilderRouter } from "./photoDocumentBuilder/router";

const APP_VIEWS = [
  path.join(__dirname, "../src/views"),
  path.join(__dirname, "../src/credentialOfferViewer/views"),
  path.join(__dirname, "../src/dbsDocumentBuilder/views"),
  path.join(__dirname, "../src/ninoDocumentBuilder/views"),
  path.join(__dirname, "../src/photoDocumentBuilder/views"),
  path.join(__dirname, "../src/appSelector/views"),
  path.join(__dirname, "../src/documentSelector/views"),
  path.join(__dirname, "../src/loggedOut/views"),
  path.resolve("node_modules/govuk-frontend/"),
];

export async function createApp(): Promise<express.Application> {
  const app: express.Application = express();

  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(auth(getOIDCConfig()));
  app.use(loggerMiddleware);
  app.use(noCacheMiddleware);

  app.use((req, res, next) => {
    req.log = req.log.child({
      trace: res.locals.trace,
    });
    next();
  });
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

  app.use(returnFromAuthRouter);
  app.use(appSelectorRouter);
  app.use(documentSelectorRouter);
  app.use(dbsDocumentBuilderRouter);
  app.use(ninoDocumentBuilderRouter);
  app.use(photoDocumentBuilderRouter);
  app.use(credentialOfferViewerRouter);
  app.use(documentRouter);
  app.use(stsStubAccessTokenRouter);
  app.use(stsStubJwksRouter);
  app.use(logoutRouter);
  app.use(loggedOutRouter);
  app.use(proofJwtRouter);

  return app;
}
