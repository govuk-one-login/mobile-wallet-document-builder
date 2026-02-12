import { Response, Request } from "express";

export interface Error {
  text: string;
  href: string;
}

export function formatValidationError(
  key: string,
  validationMessage: string,
): Record<string, Error> {
  const error: Record<string, Error> = {};
  error[key] = {
    text: validationMessage,
    href: `#${key}`,
  };
  return error;
}

export function generateErrorList(errors: Record<string, Error>) {
  if (!errors) return;
  const errorValues = Object.values(errors);
  const uniqueErrorList = [
    ...new Map(errorValues.map((error) => [error.text, error])).values(),
  ];
  return uniqueErrorList;
}

export function renderBadRequest(
  res: Response,
  req: Request,
  template: string,
  errors: Record<string, Error>,
  options?: object,
): void {
  res.status(400);

  res.render(template, {
    errors,
    errorList: generateErrorList(errors),
    ...req.body,
    ...options,
  });
}
