import { Request, Response } from "express";

export function startPageGetController() {
  return function (req: Request, res: Response): void {
    return res.render("start-page.njk");
  };
}
