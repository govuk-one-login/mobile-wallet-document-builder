import { DrivingPrivilege } from "../mdlDocumentBuilder/types/DrivingPrivilege";
import { formatDate } from "./dateValidator";

export function buildDrivingPrivileges(
    vehicleCategoryCode: string[],
    privilegeIssueDay: string[],
    privilegeIssueMonth: string[],
    privilegeIssueYear: string[],
    privilegeExpiryDay: string[],
    privilegeExpiryMonth: string[],
    privilegeExpiryYear: string[]
): DrivingPrivilege[] {
    const length = vehicleCategoryCode.length;
    if (
        !privilegeIssueDay ||
        !privilegeIssueMonth ||
        !privilegeIssueYear ||
        !privilegeExpiryDay ||
        !privilegeExpiryMonth ||
        !privilegeExpiryYear
    ) {
        throw new Error("One or more input arrays are undefined");
    }

    const drivingPrivileges: DrivingPrivilege[] = [];

    for(let i = 0; i < length; i++) {
        const issueDate = privilegeIssueDay[i] && privilegeIssueMonth[i] && privilegeIssueYear[i]
            ?formatDate(privilegeIssueDay[i], privilegeIssueMonth[i], privilegeIssueYear[i])
            : undefined;
        const expiryDate = privilegeExpiryDay[i] && privilegeExpiryMonth[i] && privilegeExpiryYear[i]
            ?formatDate(privilegeExpiryDay[i], privilegeExpiryMonth[i], privilegeExpiryYear[i])
            : undefined;
        drivingPrivileges.push({
            vehicle_category_code: vehicleCategoryCode[i],
            issue_date: issueDate,
            expiry_date: expiryDate
        });
    }
    return drivingPrivileges;
}

