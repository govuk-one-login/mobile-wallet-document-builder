export function getCredentialTtl(credentialTtl: string) {
  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(now.getFullYear() + 1);
  const oneYearTtl = Math.floor(
    (oneYearLater.getTime() - now.getTime()) / (1000 * 60),
  );
  const oneMinuteTtl = 1;

  return credentialTtl === "oneMinute" ? oneMinuteTtl : oneYearTtl;
}
