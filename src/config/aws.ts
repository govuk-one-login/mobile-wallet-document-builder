import {
  getEnvironment,
  getAwsRegion,
  getLocalStackEndpoint,
} from "./appConfig";
import { LocalStackAwsConfig } from "../types/interfaces";
import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

export function getLocalStackAwsConfig(): LocalStackAwsConfig {
  return {
    endpoint: getLocalStackEndpoint(),
    accessKeyId: "accessKeyId",
    secretAccessKey: "secretAccessKey",
    region: getAwsRegion(),
  };
}

export function getDatabaseConfig(): DynamoDBClientConfig {
  if (getEnvironment() === "local") {
    return getLocalStackAwsConfig();
  }

  return {
    region: getAwsRegion(),
  };
}
