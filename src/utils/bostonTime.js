const BOSTON_TIMEZONE = "America/New_York";

/**
 * Returns today's calendar date in Boston.
 * Format: YYYY-MM-DD
 */
export function getBostonDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOSTON_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Returns the current date/time formatted in Boston.
 */
export function getBostonDateTime() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BOSTON_TIMEZONE,
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());
}

/**
 * Returns the current Boston month in YYYY-MM.
 */
export function getBostonMonth() {
  return getBostonDate().slice(0, 7);
}

/**
 * Returns the first day of the current Boston month.
 * Format: YYYY-MM-01
 */
export function getBostonMonthStart() {
  return `${getBostonMonth()}-01`;
}

/**
 * Returns a date formatted for display in Boston.
 */
export function formatBostonDate(
  date,
  options = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BOSTON_TIMEZONE,
    ...options,
  }).format(new Date(date));
}

export { BOSTON_TIMEZONE };