import {
  formatDate,
  isDateInPast,
  isValidDate,
} from "../../src/utils/dateValidator";

describe("isValidDate", () => {
  test("should return true for valid date", () => {
    expect(isValidDate("15", "08", "2020")).toBe(true);
  });

  test("should return false for invalid day", () => {
    expect(isValidDate("32", "01", "2020")).toBe(false);
  });

  test("should return false for invalid month", () => {
    expect(isValidDate("02", "13", "2020")).toBe(false);
  });

  test("should return true for valid year", () => {
    expect(isValidDate("10", "10", "1800")).toBe(true);
    expect(isValidDate("10", "10", "2200")).toBe(true);
  });

  test("should return true for valid date like Feb 29 in a a leap year", () => {
    expect(isValidDate("29", "02", "2024")).toBe(true);
  });

  test("should return false for invalid date like June 31", () => {
    expect(isValidDate("31", "06", "2020")).toBe(false);
  });
});

describe("isDateInPast", () => {
  test("should return true for a date in the past", () => {
    expect(isDateInPast("01", "01", "2000")).toBe(true);
  });

  test("should return false for a future date", () => {
    expect(isDateInPast("01", "01", "2026")).toBe(false);
  });

  test("should return false for invalid date", () => {
    expect(isDateInPast("01", "13", "2026")).toBe(false);
  });
});

describe("formatDate", () => {
  test("should format single digit day and month correctly", () => {
    expect(formatDate("5", "9", "2020")).toBe("05-09-2020");
  });

  test("should format already padded values correctly", () => {
    expect(formatDate("15", "12", "2020")).toBe("15-12-2020");
  });
});
