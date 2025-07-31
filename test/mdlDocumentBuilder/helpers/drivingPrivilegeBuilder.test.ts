import {
  buildDrivingPrivileges,
  getFullDrivingPrivileges,
  getProvisionalDrivingPrivileges,
  stringToArray,
} from "../../../src/mdlDocumentBuilder/helpers/drivingPrivilegeBuilder";
import { MdlRequestBody } from "../../../src/mdlDocumentBuilder/types/MdlRequestBody";

describe("stringToArray", () => {
  it("should wrap a string in an array", () => {
    expect(stringToArray("abc")).toEqual(["abc"]);
  });
  it("should return the array as-is if input is already an array", () => {
    expect(stringToArray(["a", "b"])).toEqual(["a", "b"]);
  });
});

describe("buildDrivingPrivileges", () => {
  it("should set expiry date value to null when a date part is missing", () => {
    const result = buildDrivingPrivileges({
      vehicleCategoryCodes: ["C"],
      issueDays: ["2"],
      issueMonths: ["3"],
      issueYears: ["2020"],
      expiryDays: ["1"],
      expiryMonths: ["3"],
      expiryYears: [""],
    });

    expect(result).toEqual([
      {
        vehicle_category_code: "C",
        issue_date: "02-03-2020",
        expiry_date: null,
      },
    ]);
  });

  it("should build array with one driving privilege when there is one vehicle category code", () => {
    const result = buildDrivingPrivileges({
      vehicleCategoryCodes: ["C"],
      issueDays: ["2"],
      issueMonths: ["3"],
      issueYears: ["2020"],
      expiryDays: ["1"],
      expiryMonths: ["3"],
      expiryYears: ["2030"],
    });

    expect(result).toEqual([
      {
        vehicle_category_code: "C",
        issue_date: "02-03-2020",
        expiry_date: "01-03-2030",
      },
    ]);
  });

  it("should build array with two driving privileges when there are two vehicle category codes", () => {
    const result = buildDrivingPrivileges({
      vehicleCategoryCodes: ["B", "D"],
      issueDays: ["2", "11"],
      issueMonths: ["3", "12"],
      issueYears: ["2020", "2021"],
      expiryDays: ["1", "10"],
      expiryMonths: ["3", "12"],
      expiryYears: ["2030", "2031"],
    });

    expect(result).toEqual([
      {
        vehicle_category_code: "B",
        issue_date: "02-03-2020",
        expiry_date: "01-03-2030",
      },
      {
        vehicle_category_code: "D",
        issue_date: "11-12-2021",
        expiry_date: "10-12-2031",
      },
    ]);
  });
});

describe("getFullDrivingPrivileges", () => {
  it("should extract dates and build full driving privileges with one privilege", () => {
    const body = {
      "fullPrivilegeIssue-day": ["2"],
      "fullPrivilegeIssue-month": ["3"],
      "fullPrivilegeIssue-year": ["2020"],
      "fullPrivilegeExpiry-day": ["1"],
      "fullPrivilegeExpiry-month": ["3"],
      "fullPrivilegeExpiry-year": ["2030"],
      fullVehicleCategoryCode: ["B"],
    } as MdlRequestBody;

    const result = getFullDrivingPrivileges(body);

    expect(result).toEqual([
      {
        vehicle_category_code: "B",
        issue_date: "02-03-2020",
        expiry_date: "01-03-2030",
      },
    ]);
  });

  it("should handle string values in body", () => {
    const body = {
      "fullPrivilegeIssue-day": "2",
      "fullPrivilegeIssue-month": "3",
      "fullPrivilegeIssue-year": "2020",
      "fullPrivilegeExpiry-day": "1",
      "fullPrivilegeExpiry-month": "3",
      "fullPrivilegeExpiry-year": "2030",
      fullVehicleCategoryCode: "B",
    } as MdlRequestBody;

    const result = getFullDrivingPrivileges(body);

    expect(result).toEqual([
      {
        vehicle_category_code: "B",
        issue_date: "02-03-2020",
        expiry_date: "01-03-2030",
      },
    ]);
  });
});

describe("getProvisionalDrivingPrivileges", () => {
  it("should return an empty array when there are is no vehicle category code", () => {
    const body = {} as MdlRequestBody;

    expect(getProvisionalDrivingPrivileges(body)).toEqual([]);
  });

  it("should extract dates and build provisional driving privileges with one privilege", () => {
    const body = {
      provisionalVehicleCategoryCode: ["P"],
      "provisionalPrivilegeIssue-day": ["5"],
      "provisionalPrivilegeIssue-month": ["6"],
      "provisionalPrivilegeIssue-year": ["2022"],
      "provisionalPrivilegeExpiry-day": ["4"],
      "provisionalPrivilegeExpiry-month": ["6"],
      "provisionalPrivilegeExpiry-year": ["2032"],
    } as MdlRequestBody;

    const result = getProvisionalDrivingPrivileges(body);

    expect(result).toEqual([
      {
        vehicle_category_code: "P",
        issue_date: "05-06-2022",
        expiry_date: "04-06-2032",
      },
    ]);
  });

  it("should handle string values in body", () => {
    const body = {
      provisionalVehicleCategoryCode: "P",
      "provisionalPrivilegeIssue-day": "5",
      "provisionalPrivilegeIssue-month": "6",
      "provisionalPrivilegeIssue-year": "2022",
      "provisionalPrivilegeExpiry-day": "4",
      "provisionalPrivilegeExpiry-month": "6",
      "provisionalPrivilegeExpiry-year": "2032",
    } as MdlRequestBody;

    const result = getProvisionalDrivingPrivileges(body);

    expect(result).toEqual([
      {
        vehicle_category_code: "P",
        issue_date: "05-06-2022",
        expiry_date: "04-06-2032",
      },
    ]);
  });
});
