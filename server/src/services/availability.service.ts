import { DateTime } from "luxon";
import { Mentor } from "../models/Mentor.js";
import { Booking } from "../models/Booking.js";
import { localTimeToUTC } from "./timezone.service.js";

const TRIAL_DURATION_MINUTES = 60;

const START_HOUR = 9;
const END_HOUR = 20;

export interface AvailabilitySlot {
  startTimeUTC: string;
  endTimeUTC: string;
  localDate: string;
  localTime: string;
  availableMentors: number;
}

export const getAvailableSlots = async (
  date: string,
  parentTimezone: string
): Promise<AvailabilitySlot[]> => {
  const parentDate = DateTime.fromISO(date, {
    zone: parentTimezone,
  });

  if (!parentDate.isValid) {
    throw new Error("Invalid date or timezone");
  }

  // Get active mentors once
  const mentors = await Mentor.find({
    isActive: true,
  }).lean();

  if (mentors.length === 0) {
    return [];
  }

  /*
   * Fetch bookings once instead of querying MongoDB
   * separately for every mentor and every time slot.
   *
   * We fetch a wide UTC range around the selected date
   * because mentors can be in different timezones.
   */
  const selectedDayStart = parentDate.startOf("day");
  const selectedDayEnd = parentDate.endOf("day");

  const rangeStartUTC = selectedDayStart
    .minus({ days: 1 })
    .toUTC()
    .toJSDate();

  const rangeEndUTC = selectedDayEnd
    .plus({ days: 1 })
    .toUTC()
    .toJSDate();

  const bookings = await Booking.find({
    status: "confirmed",
    startTimeUTC: {
      $lt: rangeEndUTC,
    },
    endTimeUTC: {
      $gt: rangeStartUTC,
    },
  })
    .select("mentorId startTimeUTC endTimeUTC")
    .lean();

  const slots: AvailabilitySlot[] = [];

  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    const time = `${String(hour).padStart(2, "0")}:00`;

    let startUTC: DateTime;

    try {
      startUTC = localTimeToUTC(
        date,
        time,
        parentTimezone
      );
    } catch {
      continue;
    }

    const endUTC = startUTC.plus({
      minutes: TRIAL_DURATION_MINUTES,
    });

    let availableMentorCount = 0;

    for (const mentor of mentors) {
      const mentorStart = startUTC.setZone(
        mentor.timezone
      );

      const mentorEnd = endUTC.setZone(
        mentor.timezone
      );

      // Mentor working hours: 9 AM - 8 PM local time
      const startMinutes =
        mentorStart.hour * 60 + mentorStart.minute;

      const endMinutes =
        mentorEnd.hour * 60 + mentorEnd.minute;

      const workingStart = START_HOUR * 60;
      const workingEnd = END_HOUR * 60;

      // Skip if the mentor is outside working hours
      if (
        startMinutes < workingStart ||
        startMinutes >= workingEnd ||
        endMinutes > workingEnd ||
        mentorEnd.toISODate() !== mentorStart.toISODate()
      ) {
        continue;
      }

      const mentorLocalDate = mentorStart.toISODate();

      if (!mentorLocalDate) {
        continue;
      }

      /*
       * Count this mentor's bookings for their local day.
       */
      const dayStartUTC = mentorStart
        .startOf("day")
        .toUTC()
        .toJSDate();

      const dayEndUTC = mentorStart
        .endOf("day")
        .toUTC()
        .toJSDate();

      const mentorBookings = bookings.filter(
        (booking) =>
          String(booking.mentorId) ===
            String(mentor._id) &&
          booking.startTimeUTC >= dayStartUTC &&
          booking.startTimeUTC <= dayEndUTC
      );

      // Respect mentor's maximum daily booking limit
      if (
        mentorBookings.length >=
        mentor.maxDailyBookings
      ) {
        continue;
      }

      /*
       * Check whether this mentor already has a
       * confirmed booking overlapping this slot.
       */
      const hasOverlap = mentorBookings.some(
        (booking) =>
          booking.startTimeUTC <
            endUTC.toJSDate() &&
          booking.endTimeUTC >
            startUTC.toJSDate()
      );

      if (hasOverlap) {
        continue;
      }

      availableMentorCount++;
    }

    if (availableMentorCount > 0) {
      slots.push({
        startTimeUTC: startUTC.toISO()!,
        endTimeUTC: endUTC.toISO()!,
        localDate: date,
        localTime: time,
        availableMentors: availableMentorCount,
      });
    }
  }

  return slots;
};