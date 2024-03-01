import {
  getAwsRegion,
  getDocumentsTableName,
  getEnvironment,
  getLocalStackEndpoint,
  getPortNumber,
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

  it("should return the default value ('local') of the ENVIRONMENT environment variable value if not set", () => {
    process.env.ENVIRONMENT = "";
    expect(getEnvironment()).toEqual("local");
  });

  it("should return ENVIRONMENT environment variable value if set", () => {
    process.env.ENVIRONMENT = "local";
    expect(getEnvironment()).toEqual("local");
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
    expect(getLocalStackEndpoint()).toEqual("http://localhost:4566");
  });
});
