import { Request, Response } from "express";

export function dvsPageGetController() {
  return function (req: Request, res: Response): void {
    return res.render("dvs.njk");
  };
}
