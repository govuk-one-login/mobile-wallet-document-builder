function getEnvVarValue(variableName: string): string {
  const variableValue = process.env[variableName];
  if (!variableValue) {
    throw new Error(`${variableName} environment variable not set`);
  }
  return variableValue;
}

export function getPortNumber(): string {
  return getEnvVarValue("PORT");
}

export function getDocumentsTableName(): string {
  return getEnvVarValue("DOCUMENTS_TABLE_NAME");
}

export function getEnvironment(): string {
  return process.env.ENVIRONMENT || "local";
}

export function getAwsRegion(): string {
  return "eu-west-2";
}

export function getLocalStackEndpoint(): string {
  return `http://localhost:4566`;
}
