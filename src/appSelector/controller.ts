import { Request, Response } from "express";
import { logger } from "../utils/logger";
import {apps} from "../types/Apps";
import {generators} from "openid-client";
import {createHash} from "node:crypto";

const VECTORS_OF_TRUST = `["Cl"]`;

export function hash(value: string) {
  return createHash("sha256").update(value).digest("base64url");
}

export async function appSelectorGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render("select-app-form.njk");
  } catch (error) {
    logger.error(error, "An error happened rendering app selection page");
    res.render("500.njk");
  }
}

function requiresLogin(selectedApp: string) {
  return apps[selectedApp].login;
}

export async function appSelectorPostController(
    req: Request,
    res: Response
): Promise<void> {
  try {
    const selectedApp = req.body["select-app-choice"];

    if (!selectedApp) {
      res.render("select-app-form.njk", {
        isInvalid: selectedApp === undefined,
      });
    } else if (requiresLogin(selectedApp)) {
      console.log("LOGIN REQUIRED")

      const nonce = generators.nonce();
      const state = generators.state();

      res.cookie("nonce", nonce, {
        httpOnly: true,
      });
      res.cookie("state", state, {
        httpOnly: true,
      });

      const authorizationUrl = req.oidc.authorizationUrl({
        client_id: req.oidc.metadata.client_id,
        response_type: "code",
        prompt: "none",
        scope: req.oidc.metadata.scopes as string,
        state: hash(state),
        nonce: hash(nonce),
        redirect_uri: req.oidc.metadata.redirect_uris![0],
        cookie_consent: req.query.cookie_consent,
        vtr: VECTORS_OF_TRUST,
      });

      res.redirect(authorizationUrl);
    } else {
      console.log("LOGIN NOT REQUIRED")
      res.redirect(`/select-document?app=${selectedApp}`);
    }

  } catch (error) {
    logger.error(error, "An error happened selecting app");
    res.render("500.njk");
  }
}