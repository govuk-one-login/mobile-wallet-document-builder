import { portNumber } from "../src/config";

describe("config.ts", () => {
  it("should throw an error if PORT environment variable is not set ", () => {
    expect(() => portNumber({})).toThrow(
      new Error("PORT environment variable not set")
    );
  });

  it("should return PORT environment variable value if set ", () => {
    const PORT = "8000";
    expect(portNumber({ PORT })).toEqual(PORT);
  });
});
