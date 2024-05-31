import { getExpirationDate } from "../../src/dbsDocumentBuilder/getExpirationDate";

describe("getExpirationDate.ts", () => {
  beforeEach(() => {
    const mockedDate = new Date(2024, 3, 5);

    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should generate a valid expiration date", () => {
   const expirationDate = getExpirationDate();
   expect(expirationDate).toEqual("2025-04-05");
  });
})
