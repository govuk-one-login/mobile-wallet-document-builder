import { Request, Response } from "express";
import { JOURNEY_OPTIONS } from "./constants/journeyOptions";
import { JOURNEY_VALUES } from "./constants/journeyValues";
import { ROUTES } from "../config/routes";
import { formatValidationError, renderBadRequest } from "../utils/validation";

const SELECT_JOURNEY_TEMPLATE = "select-journey-form.njk";

export function dvsJourneySelectorGetController(
  req: Request,
  res: Response,
): void {
  res.render(SELECT_JOURNEY_TEMPLATE, {
    journeyOptions: JOURNEY_OPTIONS,
  });
}

export function dvsJourneySelectorPostController(
  req: Request,
  res: Response,
): void {
  const { journey } = req.body;

  if (journey === JOURNEY_VALUES.ISSUE) {
    return res.redirect(ROUTES.DVS_BUILD_TEST_DRIVING_LICENCE);
  }

  if (journey === JOURNEY_VALUES.REVOKE) {
    return res.redirect(ROUTES.REVOKE);
  }

  return renderBadRequest(
    res,
    req,
    SELECT_JOURNEY_TEMPLATE,
    formatValidationError(
      "journey",
      "Select if you want to issue or revoke a test digital driving licence",
    ),
    {
      journeyOptions: JOURNEY_OPTIONS,
    },
  );
}
