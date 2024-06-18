process.env.ENVIRONMENT = "local";
process.env.OIDC_CLIENT_ID = "client_id";
process.env.OIDC_PRIVATE_KEY = "private_key";
process.env.OIDC_ISSUER_DISCOVERY_ENDPOINT = "discovery_endpoint";
process.env.BASE_URL = "redirect_uri";

import { createApp } from "../src/app";
import { expect } from "@jest/globals";

describe("app.ts", () => {
  it("should successfully create an app", async () => {
    expect(async () => await createApp()).not.toThrow();
  });
});
