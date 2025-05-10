import {MdlRequestBody} from "../mdlDocumentBuilder/types/MdlRequestBody";
import {DrivingPrivilege} from "../mdlDocumentBuilder/types/DrivingPrivilege";
import {formatDate} from "./dateValidator";

export function buildDrivingPrivileges(
    body: MdlRequestBody,
): DrivingPrivilege[] {
  const drivingPrivileges: DrivingPrivilege[] = [];

  const issueDay = body["fullPrivilegeIssue-day"] || null;
  const issueMonth = body["fullPrivilegeIssue-month"] || null;
  const issueYear = body["fullPrivilegeIssue-year"] || null;
  const expiryDay = body["fullPrivilegeExpiry-day"] || null;
  const expiryMonth = body["fullPrivilegeExpiry-month"] || null;
  const expiryYear = body["fullPrivilegeExpiry-year"] || null;

  const numPrivileges = body["vehicleCategoryCode"]?.length || 0;

  if (numPrivileges === 1) {
    const issueDate =
        issueDay === null || issueMonth === null || issueYear === null
            ? null
            :`${issueDay}-${issueMonth}-${issueYear}`;
    const expiryDate =
        expiryDay === null || expiryMonth === null || expiryYear || null
            ? null
            : `${expiryDay}-${expiryMonth}-${expiryYear}`;
    const privilege: DrivingPrivilege = {
      vehicle_category_code: body["vehicleCategoryCode"][0],
      issue_date: issueDate,
      expiry_date: expiryDate,
    };
    drivingPrivileges.push(privilege);
  } else {
    for (let i = 0; i < numPrivileges; i++) {
      const issueDate =
          issueDay[i] === "" || issueMonth[i] === "" || issueYear[i] === ""
              ? null
              : formatDate(issueDay[i], issueMonth[i], issueYear[i]);
      const expiryDate =
          expiryDay[i] === "" || expiryMonth[i] === "" || expiryYear[i] === ""
              ? null
              : formatDate(expiryDay[i], expiryMonth[i], expiryYear[i]);

      const privilege: DrivingPrivilege = {
        vehicle_category_code: body["vehicleCategoryCode"][i],
        issue_date: issueDate,
        expiry_date: expiryDate,
      };
      drivingPrivileges.push(privilege);
    }
  }

  return drivingPrivileges;
}

