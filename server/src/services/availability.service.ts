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

  const mentors = await Mentor.find({
    isActive: true,
  });

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

      const dayStartUTC = mentorStart
        .startOf("day")
        .toUTC()
        .toJSDate();

      const dayEndUTC = mentorStart
        .endOf("day")
        .toUTC()
        .toJSDate();

      const bookingCount = await Booking.countDocuments({
        mentorId: mentor._id,
        startTimeUTC: {
          $gte: dayStartUTC,
          $lte: dayEndUTC,
        },
        status: "confirmed",
      });

      if (bookingCount >= mentor.maxDailyBookings) {
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