import { Request, Response } from "express";

export const healthcheckGetController = (
  _req: Request,
  res: Response,
): void => {
  res.status(200).send();
};
