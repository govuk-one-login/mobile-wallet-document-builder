
export function getDateFromParts(day: string, month: string, year: string){
    const paddedDay = day.padStart(2, "0");
    const paddedMonth = month.padStart(2, "0");
    return `${paddedDay}-${paddedMonth}-${year}`;
}

export function isValidDateFormat(dateStr: string) {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return false;

    const [day, month, year] = parts;
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) return false;

    return !(isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year)));
}

export function isRealDate(dateStr: string) {
    const [dayStr, monthStr, yearStr] = dateStr.split("-");
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === (month - 1) &&
        date.getDate() === day
    );
}

export function validateDateField(fieldName: string, dateStr: string) {
    if (!isValidDateFormat(dateStr)) {
        return `Invalid date format for ${fieldName}, must be in DD-MM-YYYY format. (Received: "${dateStr}")`;
    }
    if (!isRealDate(dateStr)) {
        return `${dateStr} is not a valid calendar date. (Received: "${dateStr}")`;
    }
    return null;
}