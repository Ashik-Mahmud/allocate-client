export type CalendarDateParts = {
  year: number;
  month: number;
  day: number;
  weekday: string;
};

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function resolveTimeZone(timeZone?: string | null) {
  const candidate = timeZone || "UTC";

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: candidate }).format(new Date());
    return candidate;
  } catch {
    return "UTC";
  }
}

function toDateParts(date: Date, timeZone: string): CalendarDateParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;

  return {
    year: Number(getPart("year")),
    month: Number(getPart("month")),
    day: Number(getPart("day")),
    weekday: getPart("weekday") || "Sun",
  };
}

export function getCalendarNow(timeZone?: string | null) {
  const resolvedTimeZone = resolveTimeZone(timeZone);
  const now = new Date();
  const parts = toDateParts(now, resolvedTimeZone);

  return {
    now,
    timeZone: resolvedTimeZone,
    ...parts,
  };
}

export function getCalendarMonthStart(timeZone?: string | null) {
  const current = getCalendarNow(timeZone);
  return {
    month: current.month,
    year: current.year,
    day: current.day,
    weekday: current.weekday,
    timeZone: current.timeZone,
  };
}

export function formatCalendarDate(dateKey: string, timeZone?: string | null, locale = "en-US") {
  const resolvedTimeZone = resolveTimeZone(timeZone);
  const date = new Date(`${dateKey}T12:00:00Z`);

  return new Intl.DateTimeFormat(locale, {
    timeZone: resolvedTimeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })?.format(date);
}

export function formatCalendarDayMonth(dateKey: string, timeZone?: string | null, locale = "en-US") {
  const resolvedTimeZone = resolveTimeZone(timeZone);
  const date = new Date(`${dateKey}T12:00:00Z`);

  return new Intl.DateTimeFormat(locale, {
    timeZone: resolvedTimeZone,
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatTimeInTimeZone(dateValue: string | Date, timeZone?: string | null, locale = "en-US") {
  const resolvedTimeZone = resolveTimeZone(timeZone);
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;

  return new Intl.DateTimeFormat(locale, {
    timeZone: resolvedTimeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getTimeZoneParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

function getTimeZoneOffsetMinutes(date: Date, timeZone: string) {
  const parts = getTimeZoneParts(date, timeZone);
  const utcEquivalent = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return (utcEquivalent - date.getTime()) / 60000;
}

export function formatDateTimeLocalInTimeZone(dateValue: string | Date, timeZone?: string | null) {
  const resolvedTimeZone = resolveTimeZone(timeZone);
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  const parts = getTimeZoneParts(date, resolvedTimeZone);
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function parseDateTimeLocalInTimeZone(dateTimeLocal: string, timeZone?: string | null) {
  const resolvedTimeZone = resolveTimeZone(timeZone);
  const [datePart, timePart] = dateTimeLocal.split("T");

  if (!datePart || !timePart) {
    return new Date(dateTimeLocal);
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  let utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  let offsetMinutes = getTimeZoneOffsetMinutes(new Date(utcTimestamp), resolvedTimeZone);
  let adjustedTimestamp = utcTimestamp - offsetMinutes * 60_000;

  const recalculatedOffset = getTimeZoneOffsetMinutes(new Date(adjustedTimestamp), resolvedTimeZone);
  if (recalculatedOffset !== offsetMinutes) {
    adjustedTimestamp = utcTimestamp - recalculatedOffset * 60_000;
  }

  return new Date(adjustedTimestamp);
}

export function formatCalendarDateKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getCalendarDateKey(year: number, month: number, day: number) {
  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");
  return `${year}-${paddedMonth}-${paddedDay}`;
}

export function getMonthGridStartDay(year: number, month: number, timeZone?: string | null) {
  const resolvedTimeZone = resolveTimeZone(timeZone);
  const date = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: resolvedTimeZone,
    weekday: "short",
  }).format(date);

  return WEEKDAY_TO_INDEX[weekday] ?? 0;
}

export function getTodayCalendarKey(timeZone?: string | null) {
  const current = getCalendarNow(timeZone);
  return getCalendarDateKey(current.year, current.month, current.day);
}

export function getCalendarWeekdayLabel(year: number, month: number, day: number, timeZone?: string | null) {
  const resolvedTimeZone = resolveTimeZone(timeZone);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  return new Intl.DateTimeFormat("en-US", {
    timeZone: resolvedTimeZone,
    weekday: "long",
  }).format(date);
}

export function getCalendarMonthLabel(year: number, month: number, timeZone?: string | null) {
  const resolvedTimeZone = resolveTimeZone(timeZone);
  const date = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));

  return new Intl.DateTimeFormat("en-US", {
    timeZone: resolvedTimeZone,
    month: "long",
    year: "numeric",
  }).format(date);
}
