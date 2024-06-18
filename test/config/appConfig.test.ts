import {
  getAwsRegion,
  getDocumentsTableName,
  getEnvironment,
  getLocalStackEndpoint,
  getCriEndpoint,
  getPortNumber,
  getAccessTokenTtlInSecs,
  getDidController,
  getBaseUrl,
  getOIDCClientId,
  getOIDCDiscoveryEndpoint,
  getCookieTtlInSecs,
  getClientSigningKeyId,
  getTokenTtlInSecs,
} from "../../src/config/appConfig";

describe("appConfig.ts", () => {
  it("should throw an error if PORT environment variable is not set", () => {
    expect(() => getPortNumber()).toThrow(
      new Error("PORT environment variable not set")
    );
  });

  it("should return PORT environment variable value if set", () => {
    process.env.PORT = "8000";
    expect(getPortNumber()).toEqual("8000");
  });

  it("should throw an error if DOCUMENTS_TABLE_NAME environment variable is not set", () => {
    expect(() => getDocumentsTableName()).toThrow(
      new Error("DOCUMENTS_TABLE_NAME environment variable not set")
    );
  });

  it("should return DOCUMENTS_TABLE_NAME environment variable value if set", () => {
    process.env.DOCUMENTS_TABLE_NAME = "testTable";
    expect(getDocumentsTableName()).toEqual("testTable");
  });

  it("should throw an error if ENVIRONMENT environment variable is not set", () => {
    expect(() => getEnvironment()).toThrow(
      new Error("ENVIRONMENT environment variable not set")
    );
  });

  it("should return ENVIRONMENT environment variable value if set", () => {
    process.env.ENVIRONMENT = "local";
    expect(getEnvironment()).toEqual("local");
  });

  it("should throw an error if MOCK_CRI_URL environment variable is not set", () => {
    expect(() => getCriEndpoint()).toThrow(
      new Error("MOCK_CRI_URL environment variable not set")
    );
  });

  it("should return MOCK_CRI_URL environment variable value if set", () => {
    process.env.MOCK_CRI_URL = "http://localhost:1234";
    expect(getCriEndpoint()).toEqual("http://localhost:1234");
  });

  it("should return the default value ('eu-west-2') of the AWS_REGION environment variable value if not set", () => {
    process.env.AWS_REGION = "";
    expect(getEnvironment()).toEqual("local");
  });

  it("should return AWS_REGION environment variable value if set", () => {
    process.env.AWS_REGION = "eu-west-3";
    expect(getAwsRegion()).toEqual("eu-west-3");
  });

  it("should return the LocalStack endpoint value", () => {
    expect(getLocalStackEndpoint()).toEqual("http://localhost:4561");
  });

  it("should throw an error if ACCESS_TOKEN_TTL_IN_SECS environment variable is not set", () => {
    expect(() => getAccessTokenTtlInSecs()).toThrow(
      new Error("ACCESS_TOKEN_TTL_IN_SECS environment variable not set")
    );
  });

  it("should return ACCESS_TOKEN_TTL_IN_SECS environment variable value if set", () => {
    process.env.ACCESS_TOKEN_TTL_IN_SECS = "300";
    expect(getAccessTokenTtlInSecs()).toEqual("300");
  });

  it("should throw an error if DID_CONTROLLER environment variable is not set", () => {
    expect(() => getDidController()).toThrow(
      new Error("DID_CONTROLLER environment variable not set")
    );
  });

  it("should return DID_CONTROLLER environment variable value if set", () => {
    process.env.DID_CONTROLLER = "test-did-controller";
    expect(getDidController()).toEqual("test-did-controller");
  });

  it("should throw an error if BASE_URL environment variable is not set", () => {
    expect(() => getBaseUrl()).toThrow(
      new Error("BASE_URL environment variable not set")
    );
  });

  it("should return BASE_URL environment variable value if set", () => {
    process.env.BASE_URL = "test-url";
    expect(getBaseUrl()).toEqual("test-url");
  });

  it("should throw an error if OIDC_CLIENT_ID environment variable is not set", () => {
    expect(() => getOIDCClientId()).toThrow(
      new Error("OIDC_CLIENT_ID environment variable not set")
    );
  });

  it("should return OIDC_CLIENT_ID environment variable value if set", () => {
    process.env.OIDC_CLIENT_ID = "test-client-id";
    expect(getOIDCClientId()).toEqual("test-client-id");
  });

  it("should throw an error if CLIENT_SIGNING_KEY_ID environment variable is not set", () => {
    expect(() => getClientSigningKeyId()).toThrow(
      new Error("CLIENT_SIGNING_KEY_ID environment variable not set")
    );
  });

  it("should return CLIENT_SIGNING_KEY_ID environment variable value if set", () => {
    process.env.CLIENT_SIGNING_KEY_ID = "test-client-key-id";
    expect(getClientSigningKeyId()).toEqual("test-client-key-id");
  });

  it("should throw an error if OIDC_ISSUER_DISCOVERY_ENDPOINT environment variable is not set", () => {
    expect(() => getOIDCDiscoveryEndpoint()).toThrow(
      new Error("OIDC_ISSUER_DISCOVERY_ENDPOINT environment variable not set")
    );
  });

  it("should return OIDC_ISSUER_DISCOVERY_ENDPOINT environment variable value if set", () => {
    process.env.OIDC_ISSUER_DISCOVERY_ENDPOINT = "test-discovery-endpoint";
    expect(getOIDCDiscoveryEndpoint()).toEqual("test-discovery-endpoint");
  });

  it("should throw an error if COOKIE_TTL_IN_SECS environment variable is not set", () => {
    expect(() => getCookieTtlInSecs()).toThrow(
      new Error("COOKIE_TTL_IN_SECS environment variable not set")
    );
  });

  it("should return COOKIE_TTL_IN_SECS environment variable value if set", () => {
    process.env.COOKIE_TTL_IN_SECS = "200";
    expect(getCookieTtlInSecs()).toEqual("200");
  });

  it("should throw an error if TOKEN_TTL_IN_SECS environment variable is not set", () => {
    expect(() => getTokenTtlInSecs()).toThrow(
      new Error("TOKEN_TTL_IN_SECS environment variable not set")
    );
  });

  it("should return TOKEN_TTL_IN_SECS environment variable value if set", () => {
    process.env.TOKEN_TTL_IN_SECS = "200";
    expect(getTokenTtlInSecs()).toEqual("200");
  });
});
