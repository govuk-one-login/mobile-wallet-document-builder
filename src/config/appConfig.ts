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

export function getPhotosBucketName(): string {
  return getEnvVarValue("PHOTOS_BUCKET_NAME");
}

export function getEnvironment(): string {
  return getEnvVarValue("ENVIRONMENT");
}

export function getCriEndpoint(): string {
  return getEnvVarValue("CREDENTIAL_ISSUER_URL");
}

export function getAwsRegion(): string {
  return process.env.AWS_REGION || "eu-west-2";
}

export function getStsSigningKeyId(): string {
  return getEnvVarValue("STS_SIGNING_KEY_ID");
}

export function getAccessTokenTtlInSecs(): string {
  return getEnvVarValue("ACCESS_TOKEN_TTL_IN_SECS");
}

export function getSelfUrl(): string {
  return getEnvVarValue("SELF");
}

export function getOIDCClientId(): string {
  return getEnvVarValue("OIDC_CLIENT_ID");
}

export function getClientSigningKeyId(): string {
  return getEnvVarValue("CLIENT_SIGNING_KEY_ID");
}

export function getOIDCDiscoveryEndpoint(): string {
  return getEnvVarValue("OIDC_ISSUER_DISCOVERY_ENDPOINT");
}

export function getCookieExpiryInMilliseconds() {
  const ttl = getEnvVarValue("COOKIE_TTL_IN_MILLISECONDS");
  return Number(ttl);
}

export function getHardcodedWalletSubjectId(): string {
  // This value must match the wallet_subject_id in the auth stub's user info
  return "urn:fdc:wallet.account.gov.uk:2024:DtPT8x-dp_73tnlY3KNTiCitziN9GEherD16bqxNt9i";
}

export function getWalletApps(): string[] {
  const walletApps = getEnvVarValue("WALLET_APPS");
  return walletApps.split(",");
}
