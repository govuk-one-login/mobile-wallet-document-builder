import {
  getEnvironment,
  getAwsRegion,
  getLocalStackEndpoint,
} from "./appConfig";
import { LocalStackAwsConfig } from "../types/interfaces";
import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

function getLocalStackAwsConfig(): LocalStackAwsConfig {
  return {
    endpoint: getLocalStackEndpoint(),
    accessKeyId: "accessKeyId",
    secretAccessKey: "secretAccessKey",
    region: getAwsRegion(),
  };
}

export function getDbConfig(): DynamoDBClientConfig {
  if (getEnvironment() === "local") {
    return getLocalStackAwsConfig();
  }

  return getAwsRegion();
}
