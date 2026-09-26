import { Request, Response } from "express";
import { z } from "zod";
import { createBooking } from "../services/booking.service.js";
import { isValidTimezone } from "../services/timezone.service.js";

const bookingSchema = z.object({
  parentName: z.string().min(2, "Parent name is required"),
  parentEmail: z.string().email("Valid parent email is required"),
  parentTimezone: z.string().min(1, "Parent timezone is required"),

  studentName: z.string().min(2, "Student name is required"),
  studentAge: z
    .number()
    .int()
    .min(6, "Student age must be at least 6")
    .max(17, "Student age must be at most 17"),

  startTimeUTC: z.string().min(1, "Start time is required"),
  endTimeUTC: z.string().min(1, "End time is required"),
});

export const createBookingController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = bookingSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid booking details",
        errors: parsed.error.flatten(),
      });
      return;
    }

    const {
      parentName,
      parentEmail,
      parentTimezone,
      studentName,
      studentAge,
      startTimeUTC,
      endTimeUTC,
    } = parsed.data;

    if (!isValidTimezone(parentTimezone)) {
      res.status(400).json({
        success: false,
        message: "Invalid parent timezone",
      });
      return;
    }

    const booking = await createBooking({
      parentName,
      parentEmail,
      parentTimezone,
      studentName,
      studentAge,
      startTimeUTC,
      endTimeUTC,
    });

    res.status(201).json({
      success: true,
      message: "Trial class booked successfully",
      booking: {
        id: booking._id,
        parentName: booking.parentName,
        parentEmail: booking.parentEmail,
        parentTimezone: booking.parentTimezone,
        studentName: booking.studentName,
        studentAge: booking.studentAge,
        mentorId: booking.mentorId,
        startTimeUTC: booking.startTimeUTC,
        endTimeUTC: booking.endTimeUTC,
        status: booking.status,
        meetingLink: booking.meetingLink,
      },
    });
  } catch (error) {
    console.error("Booking error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create booking";

    res.status(409).json({
      success: false,
      message,
    });
  }
};