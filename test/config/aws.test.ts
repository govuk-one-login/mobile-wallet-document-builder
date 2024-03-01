import {
  getLocalStackAwsConfig,
  getDatabaseConfig,
} from "../../src/config/aws";

describe("aws.ts", () => {
  it("should return the LocalStack AWS configuration", () => {
    expect(getLocalStackAwsConfig()).toStrictEqual({
      accessKeyId: "accessKeyId",
      endpoint: "http://localhost:4566",
      region: "eu-west-2",
      secretAccessKey: "secretAccessKey",
    });
  });

  it("should return the database configuration for the 'local' environment", () => {
    process.env.ENVIRONMENT = "local";
    expect(getDatabaseConfig()).toEqual({
      accessKeyId: "accessKeyId",
      endpoint: "http://localhost:4566",
      region: "eu-west-2",
      secretAccessKey: "secretAccessKey",
    });
  });

  it("should return the database configuration for the 'development' environment", () => {
    process.env.ENVIRONMENT = "development";
    expect(getDatabaseConfig()).toEqual({ region: "eu-west-2" });
  });
});
