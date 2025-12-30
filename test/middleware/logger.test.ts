import { logger } from "../../src/middleware/logger";

describe("logger", () => {
  it("should have log level=debug", () => {
    expect(logger.level).toBe("debug");
  });
});
