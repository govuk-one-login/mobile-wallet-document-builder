import { MdlRequestBody } from "../mdlDocumentBuilder/types/MdlRequestBody";
import { DrivingPrivilege } from "../mdlDocumentBuilder/types/DrivingPrivilege";
import { formatDate } from "./dateValidator";

export function buildDrivingPrivileges(
  body: MdlRequestBody,
): DrivingPrivilege[] {
  const drivingPrivileges: DrivingPrivilege[] = [];

  const issueDay = toArray(body["fullPrivilegeIssue-day"]);
  const issueMonth = toArray(body["fullPrivilegeIssue-month"]);
  const issueYear = toArray(body["fullPrivilegeIssue-year"]);
  const expiryDay = toArray(body["fullPrivilegeExpiry-day"]);
  const expiryMonth = toArray(body["fullPrivilegeExpiry-month"]);
  const expiryYear = toArray(body["fullPrivilegeExpiry-year"]);

  const vehicleCategoryCode = toArray(body.vehicleCategoryCode);

  for (let i = 0; i < vehicleCategoryCode.length; i++) {
    const privilege: DrivingPrivilege = {
      vehicle_category_code: vehicleCategoryCode[i],
    };

    const issueDate = getDate(issueDay[i], issueMonth[i], issueYear[i]);
    const expiryDate = getDate(expiryDay[i], expiryMonth[i], expiryYear[i]);

    if (issueDate) privilege.issue_date = issueDate;
    if (expiryDate) privilege.expiry_date = expiryDate;

    drivingPrivileges.push(privilege);
  }
  return drivingPrivileges;
}

const toArray = (input: string | string[]): string[] =>
  Array.isArray(input) ? input : [input];

const getDate = (day: string, month: string, year: string): string | null =>
  day && month && year ? formatDate(day, month, year) : null;
