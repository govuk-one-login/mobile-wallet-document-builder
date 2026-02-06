import { Request, Response } from "express";
import { JOURNEY_OPTIONS } from "./constants/journeyOptions";
import { JOURNEY_VALUES } from "./constants/journeyValues";
import { ROUTES } from "../config/routes";

export function dvsJourneySelectorGetController(
  req: Request,
  res: Response,
): void {
  res.render("select-journey-form.njk", {
    journeyOptions: JOURNEY_OPTIONS,
  });
}

export function dvsJourneySelectorPostController(
  req: Request,
  res: Response,
): void {
  const { selectedJourney } = req.body;

  if (selectedJourney === JOURNEY_VALUES.ISSUE) {
    return res.redirect(ROUTES.DVS_BUILD_TEST_DRIVING_LICENCE);
  }

  if (selectedJourney === JOURNEY_VALUES.REVOKE) {
    return res.redirect(ROUTES.REVOKE);
  }

  return res.render("select-journey-form.njk", {
    error: true,
    journeyOptions: JOURNEY_OPTIONS,
  });
}
