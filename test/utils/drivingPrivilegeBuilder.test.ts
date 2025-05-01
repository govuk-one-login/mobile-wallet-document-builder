import {buildDrivingPrivileges} from "../../src/utils/drivingPrivilegeBuilder";
import {buildMdlRequestBody} from "./mdlRequestBodyBuilder";

describe("buildDrivingPrivilege", () => {
    it("should build a single driving privilege when numPrivileges is 1", () => {
        const body = buildMdlRequestBody(
            {
                vehicleCategoryCode: ["C"],
                "fullPrivilegeIssue-day": ["01"],
                "fullPrivilegeIssue-month": ["05"],
                "fullPrivilegeIssue-year": ["2025"],
                "fullPrivilegeExpiry-day": [""],
                "fullPrivilegeExpiry-month": [""],
                "fullPrivilegeExpiry-year": [""]
            }
        );

        const numPrivileges = 1;
        const result = buildDrivingPrivileges(body, numPrivileges);

        expect(result[0]).toEqual({
                vehicle_category_code: "C",
                issue_date: "01-05-2025",
                expiry_date: "",
            },
        );
    });

    it("should build multiple driving privileges when numPrivileges is greater than 1", () => {
        const body = buildMdlRequestBody(
            {
                vehicleCategoryCode: ["A", "B"],
                "fullPrivilegeIssue-day": ["01", "01"],
                "fullPrivilegeIssue-month": ["05", "05"],
                "fullPrivilegeIssue-year": ["2025", "2025"],
                "fullPrivilegeExpiry-day": ["", "10"],
                "fullPrivilegeExpiry-month": ["", "08"],
                "fullPrivilegeExpiry-year": ["", "2030"]
            }
        );

        const numPrivileges = 2;
        const result = buildDrivingPrivileges(body, numPrivileges);

        expect(result).toEqual([
            {
                vehicle_category_code: "A",
                issue_date: "01-05-2025",
                expiry_date: "",
            },
            {
                vehicle_category_code: "B",
                issue_date: "01-05-2025",
                expiry_date: "10-08-2030",
            },
        ]);
    });

    it("should build multiple driving privileges when numPrivileges is greater than 1 and issue and expiry dates are empty", () => {
        const body = buildMdlRequestBody(
            {
                vehicleCategoryCode: ["A", "B", "C"],
                "fullPrivilegeIssue-day": ["", "", ""],
                "fullPrivilegeIssue-month": ["", "", ""],
                "fullPrivilegeIssue-year": ["", "", ""],
                "fullPrivilegeExpiry-day": ["", "", ""],
                "fullPrivilegeExpiry-month": ["", "", ""],
                "fullPrivilegeExpiry-year": ["", "", ""]
            }
        );

        const numPrivileges = 3;
        const result = buildDrivingPrivileges(body, numPrivileges);

        expect(result).toEqual([
            {
                vehicle_category_code: "A",
                issue_date: "",
                expiry_date: "",
            },
            {
                vehicle_category_code: "B",
                issue_date: "",
                expiry_date: "",
            },
            {
                vehicle_category_code: "C",
                issue_date: "",
                expiry_date: "",
            },
        ]);
    });

    it("should return an empty array if no privilege added", () => {
        const body = buildMdlRequestBody(
            {
                vehicleCategoryCode: [""],
                "fullPrivilegeIssue-day": [""],
                "fullPrivilegeIssue-month": [""],
                "fullPrivilegeIssue-year": [""],
                "fullPrivilegeExpiry-day": [""],
                "fullPrivilegeExpiry-month": [""],
                "fullPrivilegeExpiry-year": [""]
            }
        );

        const numPrivileges = 0;
        const result = buildDrivingPrivileges(body, numPrivileges);

        expect(result).toEqual([]);
    });

    
})