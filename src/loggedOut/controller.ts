import { Request, Response } from "express";

export async function loggedOutGetController(
  req: Request,
  res: Response
): Promise<void> {
  res.render("logged-out.njk");
}
