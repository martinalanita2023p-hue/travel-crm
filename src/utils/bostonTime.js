const BOSTON_TIMEZONE = "America/New_York";

export function getBostonDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOSTON_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getBostonMonthStart(
  dateString = getBostonDate()
) {
  return `${dateString.slice(0, 7)}-01`;
}

export function formatBostonDate(date, options = {}) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BOSTON_TIMEZONE,
    ...options,
  }).format(new Date(date));
}

export function formatBostonTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BOSTON_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export { BOSTON_TIMEZONE };