import { Request, Response } from "express";

export function dvsStartGetController(req: Request, res: Response): void {
    res.render("start-page.njk");
}