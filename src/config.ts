function getEnvVarValue(variableName: string, env: NodeJS.ProcessEnv): string {
  const variableValue = env[variableName];
  if (!variableValue) {
    throw new Error(`${variableName} environment variable not set`);
  }
  return variableValue;
}

export function getPortNumber(env: NodeJS.ProcessEnv = process.env): string {
  return getEnvVarValue("PORT", env);
}
