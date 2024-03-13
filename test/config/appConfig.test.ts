import {
  getAwsRegion,
  getDocumentsTableName,
  getEnvironment,
  getLocalStackEndpoint,
  getMockCriEndpoint,
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
    expect(() => getMockCriEndpoint()).toThrow(
      new Error("MOCK_CRI_URL environment variable not set")
    );
  });

  it("should return MOCK_CRI_URL environment variable value if set", () => {
    process.env.MOCK_CRI_URL = "http://localhost:1234";
    expect(getMockCriEndpoint()).toEqual("http://localhost:1234");
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
});
