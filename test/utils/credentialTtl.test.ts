import { getCredentialTtl } from "../../src/utils/CredentialTtl";

describe("getCredentialTtl", () => {
  it('should return one minute TTL if credentialTtl is "oneMinute"', () => {
    expect(getCredentialTtl("oneMinute")).toBe(1);
  });

  it('should return one year TTL if credentialTtl is not "oneMinute"', () => {
    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(now.getFullYear() + 1);
    const expectedTtl = Math.floor(
      (oneYearLater.getTime() - now.getTime()) / (1000 * 60),
    );
    expect(getCredentialTtl("anyOtherString")).toBe(expectedTtl);
  });
});
