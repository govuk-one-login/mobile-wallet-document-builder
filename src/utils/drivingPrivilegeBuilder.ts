import { DrivingPrivilege } from "../mdlDocumentBuilder/types/DrivingPrivilege";
import { formatDate } from "./dateValidator";
import {MdlRequestBody} from "../mdlDocumentBuilder/types/MdlRequestBody";


export function buildDrivingPrivileges(body: MdlRequestBody, numPrivileges: number): DrivingPrivilege[] {
    const drivingPrivileges: DrivingPrivilege[] = [];


    let issueDate = "";
    let expiryDate = "";
    let privilege: DrivingPrivilege;

    if (numPrivileges === 1) {
        issueDate = body["fullPrivilegeIssue-day"] + "-" + body["fullPrivilegeIssue-month"] + "-" + body["fullPrivilegeIssue-month"];
        expiryDate = body["fullPrivilegeExpiry-day"] + "-" + body["fullPrivilegeExpiry-month"] + "-" + body["fullPrivilegeExpiry-month"];
        privilege = {
            vehicle_category_code: body["vehicleCategoryCode"][0],
            issue_date: issueDate,
            expiry_date: expiryDate,
        };
        drivingPrivileges.push(privilege);
    } else {
        for (let i = 0; i < numPrivileges; i++) {
            const issueDate = formatDate(
                body["fullPrivilegeIssue-day"]?.[i],
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
    }

    return drivingPrivileges;
}

