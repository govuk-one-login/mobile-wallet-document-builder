import { MdlRequestBody } from "../mdlDocumentBuilder/types/MdlRequestBody";
import { DrivingPrivilege } from "../mdlDocumentBuilder/types/DrivingPrivilege";
import { formatDate } from "./dateValidator";

export function buildDrivingPrivileges(
  body: MdlRequestBody,
): DrivingPrivilege[] {
  if (!body.vehicleCategoryCode) {
    return [];
  }
  const drivingPrivileges: DrivingPrivilege[] = [];
  const issueDay = stringToArray(body["fullPrivilegeIssue-day"]!);
  const issueMonth = stringToArray(body["fullPrivilegeIssue-month"]!);
  const issueYear = stringToArray(body["fullPrivilegeIssue-year"]!);
  const expiryDay = stringToArray(body["fullPrivilegeExpiry-day"]!);
  const expiryMonth = stringToArray(body["fullPrivilegeExpiry-month"]!);
  const expiryYear = stringToArray(body["fullPrivilegeExpiry-year"]!);
  const numberOfPrivileges = stringToArray(body.vehicleCategoryCode).length;
  const vehicleCategoryCode = stringToArray(body.vehicleCategoryCode);

  for (let i = 0; i < numberOfPrivileges; i++) {
    const issueDate =
      issueDay[i] === "" || issueMonth[i] === "" || issueYear[i] === ""
        ? null
        : formatDate(issueDay[i], issueMonth[i], issueYear[i]);
    const expiryDate =
      expiryDay[i] === "" || expiryMonth[i] === "" || expiryYear[i] === ""
        ? null
        : formatDate(expiryDay[i], expiryMonth[i], expiryYear[i]);

    const privilege: DrivingPrivilege = {
      vehicle_category_code: vehicleCategoryCode[i],
      issue_date: issueDate,
      expiry_date: expiryDate,
    };
    drivingPrivileges.push(privilege);
  }

  return drivingPrivileges;
}

const stringToArray = (input: string | string[]): string[] =>
  Array.isArray(input) ? input : [input];
