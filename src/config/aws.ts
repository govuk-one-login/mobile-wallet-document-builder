import {
  getEnvironment,
  getAwsRegion,
  getLocalStackEndpoint,
} from "./appConfig";
import { LocalStackAwsConfig } from "../types/interfaces";
import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { KMSClientConfig } from "@aws-sdk/client-kms";

export function getLocalStackAwsConfig(): LocalStackAwsConfig {
  return {
    endpoint: getLocalStackEndpoint(),
    credentials: {
      accessKeyId: "accessKeyId",
      secretAccessKey: "secretAccessKey",
    },
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

export function getKmsConfig(): KMSClientConfig {
  if (getEnvironment() === "local") {
    return getLocalStackAwsConfig();
  }

  return {
    region: getAwsRegion(),
  };
}
