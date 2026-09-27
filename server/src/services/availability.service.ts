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

  /*
   * Fetch mentors and bookings at the same time.
   *
   * This removes unnecessary waiting between the two
   * independent MongoDB requests.
   */
  const selectedDayStart = parentDate.startOf("day");
  const selectedDayEnd = parentDate.endOf("day");

  /*
   * Mentors can be in different timezones, so use a wider
   * UTC range around the parent's selected day.
   */
  const rangeStartUTC = selectedDayStart
    .minus({ days: 2 })
    .toUTC()
    .toJSDate();

  const rangeEndUTC = selectedDayEnd
    .plus({ days: 2 })
    .toUTC()
    .toJSDate();

  const [mentors, bookings] = await Promise.all([
    Mentor.find({
      isActive: true,
    })
      .select(
        "_id name timezone workingHours workingDays maxDailyBookings"
      )
      .lean(),

    Booking.find({
      status: "confirmed",
      startTimeUTC: {
        $lt: rangeEndUTC,
      },
      endTimeUTC: {
        $gt: rangeStartUTC,
      },
    })
      .select("mentorId startTimeUTC endTimeUTC")
      .lean(),
  ]);

  if (mentors.length === 0) {
    return [];
  }

  /*
   * -------------------------------------------------------
   * GROUP BOOKINGS ONCE
   * -------------------------------------------------------
   *
   * Instead of doing:
   *
   * bookings.filter(...)
   *
   * for every slot and every mentor, we create a Map once.
   *
   * Key:
   * mentorId + mentor's local calendar date
   *
   * Example:
   * "67abc123|2026-09-27"
   */
  const bookingsByMentorDay = new Map<
    string,
    typeof bookings
  >();

  for (const booking of bookings) {
    const mentor = mentors.find(
      (item) =>
        String(item._id) === String(booking.mentorId)
    );

    if (!mentor) {
      continue;
    }

    const mentorLocalDate = DateTime.fromJSDate(
      booking.startTimeUTC
    )
      .setZone(mentor.timezone)
      .toISODate();

    if (!mentorLocalDate) {
      continue;
    }

    const key = `${String(booking.mentorId)}|${mentorLocalDate}`;

    const existing = bookingsByMentorDay.get(key);

    if (existing) {
      existing.push(booking);
    } else {
      bookingsByMentorDay.set(key, [booking]);
    }
  }

  const slots: AvailabilitySlot[] = [];

  /*
   * Pre-calculate the parent timezone slots.
   *
   * This means localTimeToUTC() is not repeatedly called
   * for every mentor.
   */
  const parentSlots: Array<{
    time: string;
    startUTC: DateTime;
    endUTC: DateTime;
  }> = [];

  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    const time = `${String(hour).padStart(2, "0")}:00`;

    try {
      const startUTC = localTimeToUTC(
        date,
        time,
        parentTimezone
      );

      const endUTC = startUTC.plus({
        minutes: TRIAL_DURATION_MINUTES,
      });

      parentSlots.push({
        time,
        startUTC,
        endUTC,
      });
    } catch {
      // Ignore invalid DST/local-time combinations.
    }
  }

  /*
   * -------------------------------------------------------
   * CHECK EACH SLOT
   * -------------------------------------------------------
   */
  for (const slot of parentSlots) {
    const startUTCDate = slot.startUTC.toJSDate();
    const endUTCDate = slot.endUTC.toJSDate();

    let availableMentorCount = 0;

    for (const mentor of mentors) {
      /*
       * Convert the slot into the mentor's timezone.
       *
       * Luxon handles DST automatically because the mentor
       * timezone is an IANA timezone.
       */
      const mentorStart = slot.startUTC.setZone(
        mentor.timezone
      );

      const mentorEnd = slot.endUTC.setZone(
        mentor.timezone
      );

      /*
       * ---------------------------------------------------
       * WORKING HOURS CHECK
       * ---------------------------------------------------
       */
      const startMinutes =
        mentorStart.hour * 60 + mentorStart.minute;

      const endMinutes =
        mentorEnd.hour * 60 + mentorEnd.minute;

      const workingStart = START_HOUR * 60;
      const workingEnd = END_HOUR * 60;

      if (
        startMinutes < workingStart ||
        startMinutes >= workingEnd ||
        endMinutes > workingEnd
      ) {
        continue;
      }

      /*
       * A demo class must remain inside the mentor's
       * local calendar day.
       */
      if (
        mentorStart.toISODate() !==
        mentorEnd.toISODate()
      ) {
        continue;
      }

      const mentorLocalDate =
        mentorStart.toISODate();

      if (!mentorLocalDate) {
        continue;
      }

      /*
       * ---------------------------------------------------
       * GET BOOKINGS IN O(1)
       * ---------------------------------------------------
       *
       * Instead of:
       *
       * bookings.filter(...)
       *
       * we directly retrieve the bookings for this
       * mentor + local day.
       */
      const bookingKey = `${String(
        mentor._id
      )}|${mentorLocalDate}`;

      const mentorBookings =
        bookingsByMentorDay.get(bookingKey) || [];

      /*
       * ---------------------------------------------------
       * DAILY BOOKING LIMIT
       * ---------------------------------------------------
       */
      const maxDailyBookings =
        mentor.maxDailyBookings ?? 2;

      if (
        mentorBookings.length >=
        maxDailyBookings
      ) {
        continue;
      }

      /*
       * ---------------------------------------------------
       * OVERLAP CHECK
       * ---------------------------------------------------
       *
       * Existing booking overlaps when:
       *
       * existing.start < new.end
       * AND
       * existing.end > new.start
       */
      const hasOverlap = mentorBookings.some(
        (booking) =>
          booking.startTimeUTC < endUTCDate &&
          booking.endTimeUTC > startUTCDate
      );

      if (hasOverlap) {
        continue;
      }

      availableMentorCount++;
    }

    /*
     * Only return slots where at least one mentor
     * is actually available.
     */
    if (availableMentorCount > 0) {
      slots.push({
        startTimeUTC: slot.startUTC.toISO()!,
        endTimeUTC: slot.endUTC.toISO()!,
        localDate: date,
        localTime: slot.time,
        availableMentors: availableMentorCount,
      });
    }
  }

  return slots;
};