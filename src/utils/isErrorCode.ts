import { ERROR_CHOICES } from "./errorChoices";

// Create an array of the error code values only (excluding the empty string for "No error").
const errorCodes = ERROR_CHOICES.map((e) => e.value).filter((v) => v); // Remove any falsy values

// Function to check if a given string is a valid error code. Returns true if the input matches one of the valid codes.
export function isErrorCode(input: string) {
  return errorCodes.includes(input);
}
