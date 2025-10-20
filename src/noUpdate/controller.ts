import { Request, Response } from "express";

export async function noUpdateGetController(
  req: Request,
  res: Response,
): Promise<void> {
  res.render("no-update.njk");
}
