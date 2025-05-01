import { DrivingPrivilege } from "../mdlDocumentBuilder/types/DrivingPrivilege";
import { formatDate } from "./dateValidator";
import {MdlRequestBody} from "../mdlDocumentBuilder/types/MdlRequestBody";
import {logger} from "../middleware/logger";


export function buildDrivingPrivileges(body: MdlRequestBody, numPrivileges: number): DrivingPrivilege[] {
    const drivingPrivileges: DrivingPrivilege[] = [];
    let privilege: DrivingPrivilege;

    console.log("vehicleCategoryCode:", body["vehicleCategoryCode"][0]);
    console.log("fullPrivilegeIssue-day:", body["fullPrivilegeIssue-day"]);
    console.log("fullPrivilegeIssue-month:", body["fullPrivilegeIssue-month"]);
    console.log("fullPrivilegeIssue-year:", body["fullPrivilegeIssue-year"]);
    console.log("fullPrivilegeExpiry-day:", (body["fullPrivilegeExpiry-day"][0] ? body["fullPrivilegeExpiry-day"][0] : [""]));
    console.log("fullPrivilegeExpiry-month:", body["fullPrivilegeExpiry-month"][0] ? body["fullPrivilegeExpiry-month"][0] : [""]);
    console.log("fullPrivilegeExpiry-year:", body["fullPrivilegeExpiry-year"][0] ? body["fullPrivilegeExpiry-year"][0] : [""]);


    if (numPrivileges === 1) {
        const issueDay = body["fullPrivilegeIssue-day"][0] ? body["fullPrivilegeIssue-day"][0] : [""];
        const issueMonth = body["fullPrivilegeIssue-month"][0] ? body["fullPrivilegeIssue-month"][0] : [""];
        const issueYear = body["fullPrivilegeIssue-year"][0] ? body["fullPrivilegeIssue-year"][0] : [""];
        const expiryDay = body["fullPrivilegeExpiry-day"][0] ? body["fullPrivilegeExpiry-day"][0] : [""];
        const expiryMonth = body["fullPrivilegeExpiry-month"][0] ? body["fullPrivilegeExpiry-month"][0] : [""];
        const expiryYear = body["fullPrivilegeExpiry-year"][0] ? body["fullPrivilegeExpiry-year"][0] : [""];

        let issueDate = issueDay + "-" + issueMonth + "-" + issueYear;
        if (issueDate === "--") issueDate = "";
        let expiryDate = expiryDay + "-" + expiryMonth + "-" + expiryYear;
        if (expiryDate === "--") expiryDate = "";

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

