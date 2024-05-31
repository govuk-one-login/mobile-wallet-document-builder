export function getExpirationDate() {
  const nextYear = new Date().getFullYear() + 1;
  const dateInOneYearTimestamp = new Date().setFullYear(nextYear);
  const year = new Date(dateInOneYearTimestamp).getFullYear();
  const monthTwoDigits = ("0" + (new Date(dateInOneYearTimestamp).getMonth() + 1)).slice(-2)
  const dayTwoDigits = ("0" + (new Date(dateInOneYearTimestamp).getDate())).slice(-2);
  return `${year}-${monthTwoDigits}-${dayTwoDigits}`;
}