import { DrivingPrivilege } from "../mdlDocumentBuilder/types/DrivingPrivilege";
import {MdlRequestBody} from "../mdlDocumentBuilder/types/MdlRequestBody";

export function buildDrivingPrivileges(body: MdlRequestBody, numPrivileges: number): DrivingPrivilege[] {
    const drivingPrivileges: DrivingPrivilege[] = [];
    let privilege: DrivingPrivilege;


    const issueDay = body["fullPrivilegeIssue-day"] ? body["fullPrivilegeIssue-day"] : [""];
    const issueMonth = body["fullPrivilegeIssue-month"] ? body["fullPrivilegeIssue-month"] : [""];
    const issueYear = body["fullPrivilegeIssue-year"] ? body["fullPrivilegeIssue-year"] : [""];
    const expiryDay = body["fullPrivilegeExpiry-day"] ? body["fullPrivilegeExpiry-day"] : [""];
    const expiryMonth = body["fullPrivilegeExpiry-month"] ? body["fullPrivilegeExpiry-month"] : [""];
    const expiryYear = body["fullPrivilegeExpiry-year"] ? body["fullPrivilegeExpiry-year"] : [""];

    if (numPrivileges === 1) {

        let issueDate = `${issueDay || ""}-${issueMonth || ""}-${issueYear || ""}`;
        if (issueDate === "--") issueDate = "";
        let expiryDate = `${expiryDay || ""}-${expiryMonth || ""}-${expiryYear || ""}`;
        if (expiryDate === "--") expiryDate = "";

        privilege = {
            vehicle_category_code: body["vehicleCategoryCode"][0],
            issue_date: issueDate,
            expiry_date: expiryDate,
        };
        drivingPrivileges.push(privilege);
    } else {

        for (let i=0; i<numPrivileges; i++ ) {

            let issueDate = `${issueDay[i] || ""}-${issueMonth[i] || ""}-${issueYear[i] || ""}`;
            if (issueDate === "--") issueDate = "";

            let expiryDate = `${expiryDay[i] || ""}-${expiryMonth[i] || ""}-${expiryYear[i] || ""}`;
            if (expiryDate === "--") expiryDate = "";

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

