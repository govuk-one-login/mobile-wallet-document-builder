import { MdlRequestBody } from "../mdlDocumentBuilder/types/MdlRequestBody";
import { DrivingPrivilege } from "../mdlDocumentBuilder/types/DrivingPrivilege";
import { formatDate } from "./dateValidator";

/**
 * Builds an array of driving privileges from the request body.
 * @param body The request body containing driving privilege data.
 * @returns Array of DrivingPrivilege objects.
 */
export function buildDrivingPrivileges(
  body: MdlRequestBody,
): DrivingPrivilege[] {
  const drivingPrivileges: DrivingPrivilege[] = [];

  const issueDays = toArray(body["fullPrivilegeIssue-day"]);
  const issueMonths = toArray(body["fullPrivilegeIssue-month"]);
  const issueYears = toArray(body["fullPrivilegeIssue-year"]);
  const expiryDays = toArray(body["fullPrivilegeExpiry-day"]);
  const expiryMonths = toArray(body["fullPrivilegeExpiry-month"]);
  const expiryYears = toArray(body["fullPrivilegeExpiry-year"]);
  const vehicleCategoryCodes = toArray(body.vehicleCategoryCode);

  for (let i = 0; i < vehicleCategoryCodes.length; i++) {
    const drivingPrivilege: DrivingPrivilege = {
      vehicle_category_code: vehicleCategoryCodes[i],
    };

    const issueDate = getDate(issueDays[i], issueMonths[i], issueYears[i]);
    const expiryDate = getDate(expiryDays[i], expiryMonths[i], expiryYears[i]);

    if (issueDate) drivingPrivilege.issue_date = issueDate;
    if (expiryDate) drivingPrivilege.expiry_date = expiryDate;

    drivingPrivileges.push(drivingPrivilege);
  }
  return drivingPrivileges;
}

/**
 * Converts a value to an array if it's not already one.
 */
export function toArray(input: string | string[]): string[] {
  return Array.isArray(input) ? input : [input];
}

/**
 * Creates a formatted date string from day, month, and year components.
 *
 * @param day Day component of the date.
 * @param month Month component of the date.
 * @param year Year component of the date.
 * @returns A formatted date string, or null if any of the input components are missing.
 */
export function getDate(
  day: string,
  month: string,
  year: string,
): string | null {
  if (!day || !month || !year) return null;

  return formatDate(day, month, year);
}
