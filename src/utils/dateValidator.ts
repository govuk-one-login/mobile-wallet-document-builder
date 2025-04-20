export function isValidDate(dayStr: string, monthStr: string, yearStr: string) {
  const paddedDay = dayStr.padStart(2, "0");
  const paddedMonth = monthStr.padStart(2, "0");

  if (
    paddedDay.length !== 2 ||
    paddedMonth.length !== 2 ||
    yearStr.length !== 4
  )
    return false;

  const day = parseInt(paddedDay, 10);
  const month = parseInt(paddedMonth, 10);
  const year = parseInt(yearStr, 10);

  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isDateInPast(
  dayStr: string,
  monthStr: string,
  yearStr: string,
) {
  const inputDate = new Date(yearStr + "/" + monthStr + "/" + dayStr);
  if (isNaN(inputDate.getTime())) return false;

  return inputDate.getTime() < Date.now();
}

export function formatDate(day: string, month: string, year: string) {
  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");
  return `${paddedDay}-${paddedMonth}-${year}`;
}