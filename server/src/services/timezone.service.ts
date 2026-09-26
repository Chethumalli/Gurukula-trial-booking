import { DateTime } from "luxon";

export const isValidTimezone = (timezone: string): boolean => {
  const dateTime = DateTime.now().setZone(timezone);

  return dateTime.isValid;
};

export const localTimeToUTC = (
  date: string,
  time: string,
  timezone: string
): DateTime => {
  const localDateTime = DateTime.fromISO(`${date}T${time}`, {
    zone: timezone,
  });

  if (!localDateTime.isValid) {
    throw new Error(
      `Invalid date/time for timezone ${timezone}: ${localDateTime.invalidReason}`
    );
  }

  return localDateTime.toUTC();
};

export const utcToLocalTime = (
  utcDate: Date | string,
  timezone: string
): DateTime => {
  const utcDateTime =
    utcDate instanceof Date
      ? DateTime.fromJSDate(utcDate, { zone: "utc" })
      : DateTime.fromISO(utcDate, { zone: "utc" });

  if (!utcDateTime.isValid) {
    throw new Error("Invalid UTC date");
  }

  return utcDateTime.setZone(timezone);
};

export const getLocalDate = (
  utcDate: Date,
  timezone: string
): string => {
  return DateTime.fromJSDate(utcDate, { zone: "utc" })
    .setZone(timezone)
    .toISODate()!;
};