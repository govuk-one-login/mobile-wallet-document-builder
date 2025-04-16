export function getDateFromParts(day: string, month: string, year: string) {
  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");
  return `${year}/${paddedMonth}/${paddedDay}`;
}

export function isValidDateFormat(dateStr: string) {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return false;

  const [year, month, day] = parts;
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return false;

  return !(isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year)));
}

export function isRealDate(dateStr: string) {
  const [yearStr, monthStr, dayStr] = dateStr.split("/");
  if (isEmpty(dayStr) || isEmpty(monthStr) || isEmpty(yearStr)) return false;

  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (year < 1900 || year > 2100) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isEmpty(input: string) {
  return input === "";
}

export function isDateInPast(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateInput = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  return dateInput <= todayDate;
}

export function isExpiryDateInFuture(expiryDateStr: string) {
  const expiryDate = new Date(expiryDateStr);
  if (isNaN(expiryDate.getTime())) {
    return false;
  }
  return expiryDate.getTime() > Date.now();
}

export function isValidDateInput(dateStr: string) {
  return isValidDateFormat(dateStr) && isRealDate(dateStr);
}

export function formatDate(day: string, month: string, year: string) {
  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");
  return `${paddedDay}-${paddedMonth}-${year}`;
}
