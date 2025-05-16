import { buildMdlRequestBody } from "./mdlRequestBodyBuilder";
import {buildDrivingPrivileges} from "../../src/mdlDocumentBuilder/helpers/drivingPrivilegeBuilder";

describe("buildDrivingPrivilege", () => {
  it("should build a single driving privilege when numPrivileges is 1", () => {
    const body = buildMdlRequestBody({
      fullVehicleCategoryCode: ["C"],
      "fullPrivilegeIssue-day": ["01"],
      "fullPrivilegeIssue-month": ["05"],
      "fullPrivilegeIssue-year": ["2025"],
      "fullPrivilegeExpiry-day": "",
      "fullPrivilegeExpiry-month": "",
      "fullPrivilegeExpiry-year": "",
    });
    const result = buildDrivingPrivileges(body);

    expect(result).toEqual([
      {
        vehicle_category_code: "C",
        issue_date: "01-05-2025",
        expiry_date: null,
      },
    ]);
  });

  it("should build multiple driving privileges when numPrivileges is greater than 1", () => {
    const body = buildMdlRequestBody({
      fullVehicleCategoryCode: ["A", "B"],
      "fullPrivilegeIssue-day": ["01", "01"],
      "fullPrivilegeIssue-month": ["05", "05"],
      "fullPrivilegeIssue-year": ["2025", "2025"],
      "fullPrivilegeExpiry-day": ["", "10"],
      "fullPrivilegeExpiry-month": ["", "08"],
      "fullPrivilegeExpiry-year": ["", "2030"],
    });
    const result = buildDrivingPrivileges(body);

    expect(result).toEqual([
      {
        vehicle_category_code: "A",
        issue_date: "01-05-2025",
        expiry_date: null,
      },
      {
        vehicle_category_code: "B",
        issue_date: "01-05-2025",
        expiry_date: "10-08-2030",
      },
    ]);
  });

  it("should build multiple driving privileges when numPrivileges is greater than 1 and issue and expiry dates are empty", () => {
    const body = buildMdlRequestBody({
      fullVehicleCategoryCode: ["A", "B", "C"],
      "fullPrivilegeIssue-day": ["", "", ""],
      "fullPrivilegeIssue-month": ["", "", ""],
      "fullPrivilegeIssue-year": ["", "", ""],
      "fullPrivilegeExpiry-day": ["", "", ""],
      "fullPrivilegeExpiry-month": ["", "", ""],
      "fullPrivilegeExpiry-year": ["", "", ""],
    });
    const result = buildDrivingPrivileges(body);

    expect(result).toEqual([
      {
        vehicle_category_code: "A",
        issue_date: null,
        expiry_date: null,
      },
      {
        vehicle_category_code: "B",
        issue_date: null,
        expiry_date: null,
      },
      {
        vehicle_category_code: "C",
        issue_date: null,
        expiry_date: null,
      },
    ]);
  });

  it("should return an empty array if no privilege added", () => {
    const body = buildMdlRequestBody({});
    const result = buildDrivingPrivileges(body);

    expect(result).toEqual([]);
  });
});
