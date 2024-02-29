import { getPortNumber } from "../src/config/appConfig";

describe("aws.ts", () => {
  it("should throw an error if PORT environment variable is not set ", () => {
    expect(() => getPortNumber()).toThrow(
      new Error("PORT environment variable not set")
    );
  });

  it("should return PORT environment variable value if set ", () => {
    process.env.PORT = "8000";
    expect(getPortNumber()).toEqual("8000");
  });
});
