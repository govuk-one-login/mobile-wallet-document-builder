import { MdlRequestBody } from "../types/MdlRequestBody";
import { DrivingPrivilege } from "../types/DrivingPrivilege";
import { formatDate } from "./dateFormatter";

interface BuildDrivingPrivilegesParams {
  vehicleCategoryCodes: string[];
  issueDays: string[];
  issueMonths: string[];
  issueYears: string[];
  expiryDays: string[];
  expiryMonths: string[];
  expiryYears: string[];
  restrictionCodes?: string[];
}

export function getFullDrivingPrivileges(body: MdlRequestBody) {
  const fullIssueDays = stringToArray(body["fullPrivilegeIssue-day"]);
  const fullIssueMonths = stringToArray(body["fullPrivilegeIssue-month"]);
  const fullIssueYears = stringToArray(body["fullPrivilegeIssue-year"]);
  const fullExpiryDays = stringToArray(body["fullPrivilegeExpiry-day"]);
  const fullExpiryMonths = stringToArray(body["fullPrivilegeExpiry-month"]);
  const fullExpiryYears = stringToArray(body["fullPrivilegeExpiry-year"]);
  const fullVehicleCategoryCodes = stringToArray(body.fullVehicleCategoryCode);
  const fullRestrictionCodes = stringToArray(body.fullRestrictionCodes);

  return buildDrivingPrivileges({
    vehicleCategoryCodes: fullVehicleCategoryCodes,
    issueDays: fullIssueDays,
    issueMonths: fullIssueMonths,
    issueYears: fullIssueYears,
    expiryDays: fullExpiryDays,
    expiryMonths: fullExpiryMonths,
    expiryYears: fullExpiryYears,
    restrictionCodes: fullRestrictionCodes,
  });
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

  return buildDrivingPrivileges({
    vehicleCategoryCodes: provisionalVehicleCategoryCodes,
    issueDays: provisionalIssueDays,
    issueMonths: provisionalIssueMonths,
    issueYears: provisionalIssueYears,
    expiryDays: provisionalExpiryDays,
    expiryMonths: provisionalExpiryMonths,
    expiryYears: provisionalExpiryYears,
  });
}

export const stringToArray = (input: string | string[]): string[] =>
  Array.isArray(input) ? input : [input];

export function buildDrivingPrivileges({
  vehicleCategoryCodes,
  issueDays,
  issueMonths,
  issueYears,
  expiryDays,
  expiryMonths,
  expiryYears,
  restrictionCodes = undefined,
}: BuildDrivingPrivilegesParams): DrivingPrivilege[] {
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

    const codes = [];
    if (restrictionCodes) {
      for (const code of restrictionCodes[i].split(",")) {
        if (code) {
          codes.push({ code });
        }
      }
    }

    const privilege: DrivingPrivilege = {
      vehicle_category_code: vehicleCategoryCodes[i],
      issue_date: issueDate,
      expiry_date: expiryDate,
      codes: codes.length > 0 ? codes : null,
    };
    drivingPrivileges.push(privilege);
  }

  return drivingPrivileges;
}
