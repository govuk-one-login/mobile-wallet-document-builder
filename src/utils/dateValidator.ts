export function isValidDate(dayStr: string, monthStr: string, yearStr: string) {
  const day = parseInt(dayStr);
  const month = parseInt(monthStr);
  const year = parseInt(yearStr);

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

