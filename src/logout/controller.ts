import {Request, Response} from "express";
import {logger} from "../middleware/logger";

export async function logoutPostController(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const idToken = req.cookies.id_token;
        console.log(idToken)
        // await destroyUserSessions(
        //     req,
        //     req.session.user.subjectId,
        //     req.app.locals.sessionStore
        // );
        res.redirect(req.oidc.endSessionUrl({ id_token_hint: idToken }));
    } catch (error) {
        logger.error(error, "An error happened trying to log out");
        res.render("500.njk");
    }
}