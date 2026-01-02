import { getViewCredentialOfferRedirectUrl } from "../../src/utils/getViewCredentialOfferRedirectUrl";

describe("getViewCredentialOfferRedirectUrl", () => {
  const itemId = "test-item-id";
  const credentialType = "test-type";

  it("should return the base redirect URL when no error code is provided", () => {
    const result = getViewCredentialOfferRedirectUrl(itemId, credentialType);
    expect(result).toBe(
      `/view-credential-offer/${itemId}?type=${credentialType}`,
    );
  });

  it("should append a valid error code to the redirect URL", () => {
    const validErrorCode = "ERROR:401";
    const result = getViewCredentialOfferRedirectUrl(
      itemId,
      credentialType,
      validErrorCode,
    );
    expect(result).toBe(
      `/view-credential-offer/${itemId}?type=${credentialType}&error=${validErrorCode}`,
    );
  });

  it("should not append an invalid error code to the redirect URL", () => {
    const invalidErrorCode = "INVALID_ERROR";
    const result = getViewCredentialOfferRedirectUrl(
      itemId,
      credentialType,
      invalidErrorCode,
    );
    expect(result).toBe(
      `/view-credential-offer/${itemId}?type=${credentialType}`,
    );
  });

  it("should not append an empty string as an error code", () => {
    const result = getViewCredentialOfferRedirectUrl(
      itemId,
      credentialType,
      "",
    );
    expect(result).toBe(
      `/view-credential-offer/${itemId}?type=${credentialType}`,
    );
  });

  it("should not append undefined as an error code", () => {
    const result = getViewCredentialOfferRedirectUrl(
      itemId,
      credentialType,
      undefined,
    );
    expect(result).toBe(
      `/view-credential-offer/${itemId}?type=${credentialType}`,
    );
  });
});
