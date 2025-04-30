import { DrivingPrivilege } from "../mdlDocumentBuilder/types/DrivingPrivilege";
import { formatDate } from "./dateValidator";
import {MdlRequestBody} from "../mdlDocumentBuilder/types/MdlRequestBody";

export function buildDrivingPrivileges(body: MdlRequestBody, numPrivileges: number): DrivingPrivilege[] {
    const drivingPrivileges: DrivingPrivilege[] = [];

    console.log("vehicleCategoryCode:", body["vehicleCategoryCode"][0]);
    console.log("fullPrivilegeIssue-day:", body["fullPrivilegeIssue-day"]);
    console.log("fullPrivilegeIssue-month:", body["fullPrivilegeIssue-month"]);
    console.log("fullPrivilegeIssue-year:", body["fullPrivilegeIssue-year"]);
    console.log("fullPrivilegeExpiry-day:", body["fullPrivilegeExpiry-day"]);
    console.log("fullPrivilegeExpiry-month:", body["fullPrivilegeExpiry-month"]);
    console.log("fullPrivilegeExpiry-year:", body["fullPrivilegeExpiry-year"]);

    for (let i = 0; i < numPrivileges; i++) {
        const issueDate = formatDate(
            body["fullPrivilegeIssue-day"]?.[i], // Use optional chaining
            body["fullPrivilegeIssue-month"]?.[i],
            body["fullPrivilegeIssue-year"]?.[i]
        );

        const expiryDate = formatDate(
            body["fullPrivilegeExpiry-day"]?.[i],
            body["fullPrivilegeExpiry-month"]?.[i],
            body["fullPrivilegeExpiry-year"]?.[i]
        );

        const privilege: DrivingPrivilege = {
            vehicle_category_code: body["vehicleCategoryCode"][i],
            ...(issueDate ? { issue_date: issueDate } : {}),
            ...(expiryDate ? { expiry_date: expiryDate } : {}),
        };

        drivingPrivileges.push(privilege);
    }

    return drivingPrivileges;
}

