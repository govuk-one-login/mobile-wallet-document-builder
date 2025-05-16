import { MdlRequestBody } from "../types/MdlRequestBody";
import { DrivingPrivilege } from "../types/DrivingPrivilege";
import { formatDate } from "./dateFormatter";

export function getFullDrivingPrivileges(body: MdlRequestBody) {
  const fullIssueDays = stringToArray(body["fullPrivilegeIssue-day"]);
  const fullIssueMonths = stringToArray(body["fullPrivilegeIssue-month"]);
  const fullIssueYears = stringToArray(body["fullPrivilegeIssue-year"]);
  const fullExpiryDays = stringToArray(body["fullPrivilegeExpiry-day"]);
  const fullExpiryMonths = stringToArray(body["fullPrivilegeExpiry-month"]);
  const fullExpiryYears = stringToArray(body["fullPrivilegeExpiry-year"]);
  const fullVehicleCategoryCodes = stringToArray(body.fullVehicleCategoryCode);

  return buildDrivingPrivileges(
    fullIssueDays,
    fullIssueMonths,
    fullIssueYears,
    fullExpiryDays,
    fullExpiryMonths,
    fullExpiryYears,
    fullVehicleCategoryCodes,
  );
}

export function getProvisionalDrivingPrivileges(body: MdlRequestBody) {
  if (!body.provisionalVehicleCategoryCode) {
    return [];
  }

  const provisionalVehicleCategoryCodes = stringToArray(
    body.provisionalVehicleCategoryCode,
  );
  const provisionalIssueDays = stringToArray(
    body["provisionalPrivilegeIssue-day"]!,
  );
  const provisionalIssueMonths = stringToArray(
    body["provisionalPrivilegeIssue-month"]!,
  );
  const provisionalIssueYears = stringToArray(
    body["provisionalPrivilegeIssue-year"]!,
  );
  const provisionalExpiryDays = stringToArray(
    body["provisionalPrivilegeExpiry-day"]!,
  );
  const provisionalExpiryMonths = stringToArray(
    body["provisionalPrivilegeExpiry-month"]!,
  );
  const provisionalExpiryYears = stringToArray(
    body["provisionalPrivilegeExpiry-year"]!,
  );

  return buildDrivingPrivileges(
    provisionalVehicleCategoryCodes,
    provisionalIssueDays,
    provisionalIssueMonths,
    provisionalIssueYears,
    provisionalExpiryDays,
    provisionalExpiryMonths,
    provisionalExpiryYears,
  );
}

export const stringToArray = (input: string | string[]): string[] =>
  Array.isArray(input) ? input : [input];

export function buildDrivingPrivileges(
  issueDays: string[],
  issueMonths: string[],
  issueYears: string[],
  expiryDays: string[],
  expiryMonths: string[],
  expiryYears: string[],
  vehicleCategoryCodes: string[],
): DrivingPrivilege[] {
  const drivingPrivileges: DrivingPrivilege[] = [];

  for (let i = 0; i < vehicleCategoryCodes.length; i++) {
    const issueDate =
      issueDays[i] === "" || issueMonths[i] === "" || issueYears[i] === ""
        ? null
        : formatDate(issueDays[i], issueMonths[i], issueYears[i]);
    const expiryDate =
      expiryDays[i] === "" || expiryMonths[i] === "" || expiryYears[i] === ""
        ? null
        : formatDate(expiryDays[i], expiryMonths[i], expiryYears[i]);

    const privilege: DrivingPrivilege = {
      vehicle_category_code: vehicleCategoryCodes[i],
      issue_date: issueDate,
      expiry_date: expiryDate,
    };
    drivingPrivileges.push(privilege);
  }

  return drivingPrivileges;
}
