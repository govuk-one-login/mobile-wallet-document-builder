import "dotenv/config";
import { createApp } from "../src/app";
import { expect } from "@jest/globals";

describe("app.ts", () => {
  it("should successfully create an app", async () => {
    expect(async () => await createApp()).not.toThrow();
  });
});
