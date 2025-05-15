import {
  buildDrivingPrivileges,
  getDate,
  toArray,
} from "../../src/utils/drivingPrivilegeBuilder";
import { buildMdlRequestBody } from "./mdlRequestBodyBuilder";

describe("buildDrivingPrivileges", () => {
  describe("given there are no date parts missing", () => {
    describe("when there is one driving privilege", () => {
      it("should build one driving privilege object with all properties", () => {
        const body = buildMdlRequestBody({
          vehicleCategoryCode: "C",
          "fullPrivilegeIssue-day": "01",
          "fullPrivilegeIssue-month": "05",
          "fullPrivilegeIssue-year": "2025",
          "fullPrivilegeExpiry-day": "30",
          "fullPrivilegeExpiry-month": "04",
          "fullPrivilegeExpiry-year": "2035",
        });
        const result = buildDrivingPrivileges(body);

        expect(result).toEqual([
          {
            vehicle_category_code: "C",
            issue_date: "01-05-2025",
            expiry_date: "30-04-2035",
          },
        ]);
      });
    });

    describe("when there are two driving privileges", () => {
      it("should build two driving privilege object with all properties", () => {
        const body = buildMdlRequestBody({
          vehicleCategoryCode: ["A", "B"],
          "fullPrivilegeIssue-day": ["02", "03"],
          "fullPrivilegeIssue-month": ["05", "06"],
          "fullPrivilegeIssue-year": ["2024", "2025"],
          "fullPrivilegeExpiry-day": ["05", "10"],
          "fullPrivilegeExpiry-month": ["05", "05"],
          "fullPrivilegeExpiry-year": ["2034", "2035"],
        });
        const result = buildDrivingPrivileges(body);

        expect(result).toEqual([
          {
            vehicle_category_code: "A",
            issue_date: "02-05-2024",
            expiry_date: "05-05-2034",
          },
          {
            vehicle_category_code: "B",
            issue_date: "03-06-2025",
            expiry_date: "10-05-2035",
          },
        ]);
      });
    });
  });

  describe("given there are date parts missing", () => {
    describe("when any of the issue date parts are missing", () => {
      it("should build one driving privilege object without an issue date", () => {
        const body = buildMdlRequestBody({
          vehicleCategoryCode: "C",
          "fullPrivilegeIssue-day": "01",
          "fullPrivilegeIssue-month": "",
          "fullPrivilegeIssue-year": "2025",
          "fullPrivilegeExpiry-day": "30",
          "fullPrivilegeExpiry-month": "04",
          "fullPrivilegeExpiry-year": "2035",
        });
        const result = buildDrivingPrivileges(body);

        expect(result).toEqual([
          {
            vehicle_category_code: "C",
            expiry_date: "30-04-2035",
          },
        ]);
      });
    });

    describe("when any of the expiry date parts are missing", () => {
      it("should build one driving privilege object without an expiry date", () => {
        const body = buildMdlRequestBody({
          vehicleCategoryCode: "C",
          "fullPrivilegeIssue-day": "01",
          "fullPrivilegeIssue-month": "05",
          "fullPrivilegeIssue-year": "2025",
          "fullPrivilegeExpiry-day": "",
          "fullPrivilegeExpiry-month": "04",
          "fullPrivilegeExpiry-year": "2035",
        });
        const result = buildDrivingPrivileges(body);

        expect(result).toEqual([
          {
            vehicle_category_code: "C",
            issue_date: "01-05-2025",
          },
        ]);
      });
    });

    describe("when any of the issue and expiry date parts are missing", () => {
      it("should build one driving privilege object without an issue and expiry date", () => {
        const body = buildMdlRequestBody({
          vehicleCategoryCode: "C",
          "fullPrivilegeIssue-day": "01",
          "fullPrivilegeIssue-month": "05",
          "fullPrivilegeIssue-year": "",
          "fullPrivilegeExpiry-day": "",
          "fullPrivilegeExpiry-month": "04",
          "fullPrivilegeExpiry-year": "2035",
        });
        const result = buildDrivingPrivileges(body);

        expect(result).toEqual([
          {
            vehicle_category_code: "C",
          },
        ]);
      });
    });
  });
});

describe("toArray", () => {
  it("should convert string to array", () => {
    expect(toArray("test")).toEqual(["test"]);
  });

  it("should keep array as is", () => {
    expect(toArray(["test1", "test2"])).toEqual(["test1", "test2"]);
  });

  it("should handle undefined and null", () => {
    expect(toArray(undefined)).toEqual([]);
    expect(toArray(null)).toEqual([]);
  });
});

describe("getDate", () => {
  it("should return formatted date for valid inputs", () => {
    expect(getDate("15", "4", "2025")).toBe("15-04-2025");
  });

  test("should return null when inputs contain empty string values", () => {
    expect(getDate("", "4", "2025")).toBe(null);
    expect(getDate("15", "", "2025")).toBe(null);
    expect(getDate("15", "4", "")).toBe(null);
  });
});
