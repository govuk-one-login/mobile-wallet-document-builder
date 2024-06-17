import { generators } from "openid-client";
import e from "express";
import { getCookieExpiry } from "./getCookieExpiry";
// import {createHash} from "node:crypto";

const VECTORS_OF_TRUST = `["Cl"]`;

// export function hash(value: string) {
//   return createHash("sha256").update(value).digest("base64url");
// }

export function getAuthorizationUrl(req: e.Request, res: e.Response) {
  const nonce = generators.nonce();
  const state = generators.state();

  res.cookie("nonce", nonce, {
    httpOnly: true,
    maxAge: getCookieExpiry(),
  });
  res.cookie("state", state, {
    httpOnly: true,
    maxAge: getCookieExpiry(),
  });

  return req.oidc.authorizationUrl({
    client_id: req.oidc.metadata.client_id,
    response_type: "code",
    prompt: "none",
    scope: req.oidc.metadata.scopes as string,
    // state: hash(state), // DOES THIS NEED TO BE HASHED?
    // nonce: hash(nonce), // DOES THIS NEED TO BE HASHED?
    state: state,
    nonce: nonce,
    redirect_uri: req.oidc.metadata.redirect_uris![0],
    cookie_consent: req.query.cookie_consent,
    vtr: VECTORS_OF_TRUST,
  });
}
