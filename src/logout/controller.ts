import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { getSelfUrl } from "../config/appConfig";

const COOKIES_TO_DELETE = ["id_token", "access_token", "app"];

export function deleteCookies(
  req: Request,
  res: Response,
  cookieNames: string[]
): void {
  if (req.cookies) {
    if (cookieNames) {
      for (const cookieName of Object.keys(req.cookies)) {
        if (cookieNames.includes(cookieName)) {
          res.clearCookie(cookieName);
        }
      }
    }
  }
}
export async function logoutGetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const idToken = req.cookies.id_token;
    const state = req.cookies.state;
    deleteCookies(req, res, COOKIES_TO_DELETE);

    const postLogoutRedirectUri = getSelfUrl() + "/logged-out";
    res.redirect(
      req.oidc.endSessionUrl({
        id_token_hint: idToken,
        post_logout_redirect_uri: postLogoutRedirectUri,
        state: state,
      })
    );
  } catch (error) {
    logger.error(error, "An error happened trying to logout");
    res.render("500.njk");
  }
}
