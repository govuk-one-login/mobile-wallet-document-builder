import { Request, Response } from "express";

export async function loggedOutGetController(
  req: Request,
  res: Response
): Promise<void> {
  res.status(401);
  res.render("logged-out.njk");
}
