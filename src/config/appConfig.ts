function getEnvVarValue(variableName: string): string {
  const variableValue = process.env[variableName];
  if (!variableValue) {
    throw new Error(`${variableName} environment variable not set`);
  }
  return variableValue;
}

export function getLogLevel(): string {
  return process.env.LOGS_LEVEL || "debug";
}

export function getPortNumber(): string {
  return getEnvVarValue("PORT");
}

export function getDocumentsTableName(): string {
  return getEnvVarValue("DOCUMENTS_TABLE_NAME");
}

export function getEnvironment(): string {
  return getEnvVarValue("ENVIRONMENT");
}

export function getCriEndpoint(): string {
  return getEnvVarValue("MOCK_CRI_URL");
}

export function getAwsRegion(): string {
  return process.env.AWS_REGION || "eu-west-2";
}

export function getLocalStackEndpoint(): string {
  return `http://localhost:4561`;
}

export function getStsSigningKeyId(): string {
  return getEnvVarValue("STS_SIGNING_KEY_ID");
}

export function getAccessTokenTtlInSecs(): string {
  return getEnvVarValue("ACCESS_TOKEN_TTL_IN_SECS");
}

export function getDidController(): string {
  return getEnvVarValue("DID_CONTROLLER");
}

export function getBaseUrl(): string {
  return getEnvVarValue("BASE_URL");
}

export function getOIDCClientId(): string {
  return getEnvVarValue("OIDC_CLIENT_ID");
}

export function getOIDCPrivateKey(): string {
  return getEnvVarValue("OIDC_PRIVATE_KEY");
}

export function getOIDCDiscoveryEndpoint(): string {
  return getEnvVarValue("OIDC_DISCOVERY_ENDPOINT");
}
