import { Request, Response } from "express";

export function issuerStartGetController(req: Request, res: Response) {
  res.render("start-now.njk");
}
