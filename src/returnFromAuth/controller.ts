import { Request, Response } from "express";
import { logger } from "../utils/logger";
import {CallbackParamsType, TokenSet} from "openid-client";
import {createJwtAssertion} from "./createJwtAssertion";
// import {createJwtAssertion} from "./createJwtAssertion";

export async function returnFromAuthGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("returnFromAuthGetController");

    const queryParams: CallbackParamsType = req.oidc.callbackParams(req);
    if (queryParams.error) {
      logger.error(`${req.query.error} - ${req.query.error_description}`);
      if (queryParams.error === "access_denied") {
        res.status(403);
      }
      res.status(500);
    }


    const jwtAssertion = createJwtAssertion(req.oidc.metadata.client_id, req.oidc.issuer.metadata.token_endpoint!)

    const tokenResponse: TokenSet = await req.oidc.callback(
        req.oidc.metadata.redirect_uris![0],
        queryParams,
        { nonce: req.cookies.nonce, state: req.cookies.state },
        {
          exchangeBody: {
            client_assertion_type:
                "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            client_assertion: jwtAssertion,
          },
        }
    );
    console.log('received and validated tokens %j', tokenResponse);
    console.log('validated ID Token claims %j', tokenResponse.claims());

    // https://stub-credential-issuer.mobile.build.account.gov.uk/return-from-auth?
    // code=GPDZtk4BCUf5vzm3F1gulswenpsaqvRy2eoAMKMMUww
    // &state=41r4dalry7HgTG8uSF_OeJnqzWKgZD38C8eFV-79IS8

  } catch (error) {
    logger.error(error, "An error happened returning from auth");
    res.render("500.njk");
  }
}
