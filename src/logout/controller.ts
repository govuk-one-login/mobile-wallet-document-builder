import {Request, Response} from "express";
import {logger} from "../middleware/logger";

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
export async function logoutPostController(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const idToken = req.cookies.id_token;
        deleteCookies(req, res, COOKIES_TO_DELETE);
        res.redirect(req.oidc.endSessionUrl({ id_token_hint: idToken }));
    } catch (error) {
        logger.error(error, "An error happened trying to logout");
        res.render("500.njk");
    }
}