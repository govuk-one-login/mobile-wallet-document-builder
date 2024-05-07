import {
  getEnvironment,
  getAwsRegion,
  getLocalStackEndpoint,
} from "./appConfig";
import { LocalStackAwsConfig } from "../types/LocalStackAwsConfig";
import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { KMSClientConfig } from "@aws-sdk/client-kms";
import { logger } from "../utils/logger";

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
    logger.info("Running database locally");
    return getLocalStackAwsConfig();
  }

  return {
    region: getAwsRegion(),
  };
}

export function getKmsConfig(): KMSClientConfig {
  if (getEnvironment() === "local") {
    logger.info("Running KMS locally");
    return getLocalStackAwsConfig();
  }

  return {
    region: getAwsRegion(),
  };
}
