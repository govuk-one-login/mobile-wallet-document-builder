import e from "express";

export function isAuthenticated(req: e.Request): boolean {
  if (req.cookies?.id_token) {
    return true;
  } else {
    return false;
  }
}
