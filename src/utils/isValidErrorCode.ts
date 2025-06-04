import { ERROR_CODES } from "./errorCodes";

const VALID_ERROR_VALUES = ERROR_CODES.map((code) => code.value);

export function isValidErrorCode(selectedError: string) {
  return VALID_ERROR_VALUES.includes(selectedError);
}
