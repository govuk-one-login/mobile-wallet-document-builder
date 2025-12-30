import { logger } from "../../src/middleware/logger";

describe("logger", () => {
  it("should have the correct level", () => {
    expect(logger.level).toBe("debug");
  });
});
