import { DrivingPrivilege } from "../mdlDocumentBuilder/types/DrivingPrivilege";
import {MdlRequestBody} from "../mdlDocumentBuilder/types/MdlRequestBody";
import {formatDate} from "./dateValidator";

export function buildDrivingPrivileges(body: MdlRequestBody, numPrivileges: number): DrivingPrivilege[] {
    const drivingPrivileges: DrivingPrivilege[] = [];


    const issueDay = body["fullPrivilegeIssue-day"] || [];
    const issueMonth = body["fullPrivilegeIssue-month"] || [];
    const issueYear = body["fullPrivilegeIssue-year"] || [];
    const expiryDay = body["fullPrivilegeExpiry-day"] || [];
    const expiryMonth = body["fullPrivilegeExpiry-month"] || [];
    const expiryYear = body["fullPrivilegeExpiry-year"] || [];

    // if (numPrivileges === 1) {
    //     let issueDate: string | undefined = undefined;
    //     if (body["fullPrivilegeIssue-day"] !== undefined || issueMonth !== undefined || issueYear !== undefined) {
    //         issueDate = formatDate(body["fullPrivilegeIssue-day"], issueMonth, issueYear)
    //     }
    //
    //     if (issueDate === "--") issueDate = undefined;
    //     let expiryDate: string | undefined = `${expiryDay || ""}-${expiryMonth || ""}-${expiryYear || ""}`;
    //     if (expiryDate === "--") expiryDate = undefined;
    //
    //     privilege = {
    //         vehicle_category_code: body["vehicleCategoryCode"][0],
    //         issue_date: issueDate,
    //         expiry_date: expiryDate,
    //     };
    //     drivingPrivileges.push(privilege);
    // } else {
    for (let i=0; i<numPrivileges; i++ ) {

        const issueDate = (issueDay[i] === "") ? undefined : formatDate(issueDay[i], issueMonth[i], issueYear[i]);

        let expiryDate = `${expiryDay[i] || ""}-${expiryMonth[i] || ""}-${expiryYear[i] || ""}`;
        if (expiryDate === "--") expiryDate = "";

        const privilege: DrivingPrivilege = {
            vehicle_category_code: body["vehicleCategoryCode"][i],
            issue_date: issueDate,
            expiry_date: expiryDate,
        };
        drivingPrivileges.push(privilege);
        }

    return drivingPrivileges;
}
