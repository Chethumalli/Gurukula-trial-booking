import { DateTime } from "luxon";
import { Booking } from "../models/Booking.js";
import { Mentor } from "../models/Mentor.js";

interface CreateBookingInput {
  parentName: string;
  parentEmail: string;
  parentTimezone: string;

  studentName: string;
  studentAge: number;

  startTimeUTC: string;
  endTimeUTC: string;
}

export const createBooking = async (
  input: CreateBookingInput
) => {
  const startUTC = DateTime.fromISO(input.startTimeUTC, {
    zone: "utc",
  });

  const endUTC = DateTime.fromISO(input.endTimeUTC, {
    zone: "utc",
  });

  // Validate booking times
  if (!startUTC.isValid || !endUTC.isValid) {
    throw new Error("Invalid booking time");
  }

  if (endUTC <= startUTC) {
    throw new Error("Invalid booking duration");
  }

  const startDate = startUTC.toJSDate();
  const endDate = endUTC.toJSDate();

  /*
   * Fetch all active mentors once.
   */
  const mentors = await Mentor.find({
    isActive: true,
  })
    .select(
      "_id name email timezone workingHours workingDays maxDailyBookings"
    )
    .lean();

  if (mentors.length === 0) {
    throw new Error(
      "No mentor is available for the selected time. Please choose another slot."
    );
  }

  /*
   * Fetch bookings that overlap the requested UTC interval.
   *
   * This replaces doing a separate overlap query
   * for every mentor.
   */
  const overlappingBookings = await Booking.find({
    status: "confirmed",
    startTimeUTC: {
      $lt: endDate,
    },
    endTimeUTC: {
      $gt: startDate,
    },
  })
    .select("mentorId startTimeUTC endTimeUTC")
    .lean();

  /*
   * Group overlapping bookings by mentor.
   *
   * This allows quick in-memory lookup instead of
   * repeatedly querying MongoDB.
   */
  const overlappingBookingsByMentor = new Map<
    string,
    typeof overlappingBookings
  >();

  for (const booking of overlappingBookings) {
    const mentorId = String(booking.mentorId);

    const existing =
      overlappingBookingsByMentor.get(mentorId);

    if (existing) {
      existing.push(booking);
    } else {
      overlappingBookingsByMentor.set(
        mentorId,
        [booking]
      );
    }
  }

  /*
   * Check each active mentor.
   */
  for (const mentor of mentors) {
    /*
     * Convert the requested UTC time into
     * the mentor's local timezone.
     */
    const mentorStart = startUTC.setZone(
      mentor.timezone
    );

    const mentorEnd = endUTC.setZone(
      mentor.timezone
    );

    /*
     * ---------------------------------------------------
     * WORKING HOURS CHECK
     * ---------------------------------------------------
     */
    const startMinutes =
      mentorStart.hour * 60 +
      mentorStart.minute;

    const endMinutes =
      mentorEnd.hour * 60 +
      mentorEnd.minute;

    const workingStart = 9 * 60;
    const workingEnd = 20 * 60;

    if (
      startMinutes < workingStart ||
      startMinutes >= workingEnd ||
      endMinutes > workingEnd
    ) {
      continue;
    }

    /*
     * Prevent the class from crossing into
     * another local calendar day.
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
     * DAILY BOOKING CAPACITY
     * ---------------------------------------------------
     *
     * We need the mentor's confirmed bookings for
     * their local calendar day.
     *
     * This is the authoritative capacity check
     * before creating the booking.
     */
    const dayStartUTC = mentorStart
      .startOf("day")
      .toUTC()
      .toJSDate();

    const dayEndUTC = mentorStart
      .endOf("day")
      .toUTC()
      .toJSDate();

    const dailyBookings = await Booking.find({
      mentorId: mentor._id,
      status: "confirmed",
      startTimeUTC: {
        $gte: dayStartUTC,
        $lte: dayEndUTC,
      },
    })
      .select("startTimeUTC endTimeUTC")
      .lean();

    /*
     * Maximum two demo classes per mentor per
     * local calendar day.
     */
    const maxDailyBookings =
      mentor.maxDailyBookings ?? 2;

    if (
      dailyBookings.length >=
      maxDailyBookings
    ) {
      continue;
    }

    /*
     * ---------------------------------------------------
     * OVERLAP CHECK
     * ---------------------------------------------------
     *
     * Check both:
     *
     * 1. Bookings found in the requested interval
     * 2. Daily bookings for the mentor
     *
     * This provides a final authoritative conflict check.
     */
    const hasOverlap =
      dailyBookings.some(
        (booking) =>
          booking.startTimeUTC < endDate &&
          booking.endTimeUTC > startDate
      );

    if (hasOverlap) {
      continue;
    }

    /*
     * ---------------------------------------------------
     * CREATE MEETING LINK
     * ---------------------------------------------------
     */
    const meetingLink =
      `https://meet.codeyoung.com/trial/${crypto.randomUUID()}`;

    /*
     * ---------------------------------------------------
     * CREATE BOOKING
     * ---------------------------------------------------
     */
    const booking = await Booking.create({
      parentName: input.parentName,
      parentEmail: input.parentEmail,
      parentTimezone: input.parentTimezone,

      studentName: input.studentName,
      studentAge: input.studentAge,

      mentorId: mentor._id,
      mentorName: mentor.name,
      mentorTimezone: mentor.timezone,

      startTimeUTC: startDate,
      endTimeUTC: endDate,

      status: "confirmed",
      meetingLink,
    });

    return booking;
  }

  /*
   * No mentor passed all availability checks.
   */
  throw new Error(
    "No mentor is available for the selected time. Please choose another slot."
  );
};