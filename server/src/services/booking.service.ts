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

  if (!startUTC.isValid || !endUTC.isValid) {
    throw new Error("Invalid booking time");
  }

  if (endUTC <= startUTC) {
    throw new Error("Invalid booking duration");
  }

  const mentors = await Mentor.find({
    isActive: true,
  });

  for (const mentor of mentors) {
    const mentorStart = startUTC.setZone(mentor.timezone);
    const mentorEnd = endUTC.setZone(mentor.timezone);

    const startMinutes =
      mentorStart.hour * 60 + mentorStart.minute;

    const endMinutes =
      mentorEnd.hour * 60 + mentorEnd.minute;

    const workingStart = 9 * 60;
    const workingEnd = 20 * 60;

    if (
      startMinutes < workingStart ||
      endMinutes > workingEnd
    ) {
      continue;
    }

    // Prevent bookings that cross into another local calendar day.
    if (
      mentorStart.toISODate() !== mentorEnd.toISODate()
    ) {
      continue;
    }

    const mentorLocalDate = mentorStart.toISODate();

    if (!mentorLocalDate) {
      continue;
    }

    const dayStartUTC = mentorStart
      .startOf("day")
      .toUTC()
      .toJSDate();

    const dayEndUTC = mentorStart
      .endOf("day")
      .toUTC()
      .toJSDate();

    const dailyBookingCount =
      await Booking.countDocuments({
        mentorId: mentor._id,
        status: "confirmed",
        startTimeUTC: {
          $gte: dayStartUTC,
          $lte: dayEndUTC,
        },
      });

    if (dailyBookingCount >= mentor.maxDailyBookings) {
      continue;
    }

    const overlappingBooking =
      await Booking.findOne({
        mentorId: mentor._id,
        status: "confirmed",
        startTimeUTC: {
          $lt: endUTC.toJSDate(),
        },
        endTimeUTC: {
          $gt: startUTC.toJSDate(),
        },
      });

    if (overlappingBooking) {
      continue;
    }

    const meetingLink = `https://meet.codeyoung.com/trial/${crypto.randomUUID()}`;

    const booking = await Booking.create({
      parentName: input.parentName,
      parentEmail: input.parentEmail,
      parentTimezone: input.parentTimezone,

      studentName: input.studentName,
      studentAge: input.studentAge,

      mentorId: mentor._id,
      startTimeUTC: startUTC.toJSDate(),
      endTimeUTC: endUTC.toJSDate(),
      status: "confirmed",
      meetingLink,
    });

    return booking;
  }

  throw new Error(
    "No mentor is available for the selected time. Please choose another slot."
  );
};