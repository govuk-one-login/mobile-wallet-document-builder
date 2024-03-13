import {
  getLocalStackAwsConfig,
  getDatabaseConfig,
} from "../../src/config/aws";

describe("aws.ts", () => {
  it("should return the LocalStack AWS configuration", () => {
    expect(getLocalStackAwsConfig()).toStrictEqual({
      credentials: {
        accessKeyId: "accessKeyId",
        secretAccessKey: "secretAccessKey",
      },
      endpoint: "http://localhost:4561",
      region: "eu-west-2",
    });
  });

  it("should return the database configuration for the 'local' environment", () => {
    process.env.ENVIRONMENT = "local";
    expect(getDatabaseConfig()).toStrictEqual({
      credentials: {
        accessKeyId: "accessKeyId",
        secretAccessKey: "secretAccessKey",
      },
      endpoint: "http://localhost:4561",
      region: "eu-west-2",
    });
  });

  it("should return the database configuration for the 'development' environment", () => {
    process.env.ENVIRONMENT = "development";
    expect(getDatabaseConfig()).toStrictEqual({ region: "eu-west-2" });
  });
});
