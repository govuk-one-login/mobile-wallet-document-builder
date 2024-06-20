import e from "express";

export function isAuthenticated(req: e.Request, res: e.Response) : boolean {
    if (req.cookies && req.cookies.id_token) {
        return true;
    }
    else {
        return false;
    }
}