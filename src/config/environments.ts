export const ENVIRONMENTS = {
  LOCAL: "local",
  DEV: "dev",
  BUILD: "build",
  STAGE: "stage",
  INT: "int",
};

export const dvsNonProdEnvs = [
  ENVIRONMENTS.LOCAL,
  ENVIRONMENTS.DEV,
  ENVIRONMENTS.BUILD,
];
export const dvsProdEnvs = [ENVIRONMENTS.INT];
export const allDvsEnvs = [...dvsNonProdEnvs, ...dvsProdEnvs];

export const gdsEnvs = [
  ENVIRONMENTS.LOCAL,
  ENVIRONMENTS.DEV,
  ENVIRONMENTS.BUILD,
  ENVIRONMENTS.STAGE,
];
