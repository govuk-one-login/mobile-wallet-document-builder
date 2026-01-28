import { Request, Response } from "express";

export function dvsStartPageGetController() {
  return function (req: Request, res: Response): void {
    return res.render("dvs-start.njk");
  };
}
