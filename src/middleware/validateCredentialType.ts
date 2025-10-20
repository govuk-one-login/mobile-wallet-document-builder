import { NextFunction, Request, Response } from "express";
import { CredentialType } from "../types/CredentialType";
import { logger } from "./logger";

const VALID_TYPES = Object.values(CredentialType);

export function validateCredentialType(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { credentialType } = req.params;
  if (!VALID_TYPES.includes(credentialType as CredentialType)) {
    logger.error(
      `Invalid credential type path parameter provided: ${credentialType}`,
    );
    return res.render("500.njk");
  }
  next();
}
