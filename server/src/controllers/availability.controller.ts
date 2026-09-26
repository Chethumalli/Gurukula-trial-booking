import { Request, Response } from "express";
import { z } from "zod";
import { getAvailableSlots } from "../services/availability.service.js";
import { isValidTimezone } from "../services/timezone.service.js";

const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  timezone: z.string().min(1, "Timezone is required"),
});

export const getAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = availabilitySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid availability request",
        errors: parsed.error.flatten(),
      });
      return;
    }

    const { date, timezone } = parsed.data;

    if (!isValidTimezone(timezone)) {
      res.status(400).json({
        success: false,
        message: "Invalid timezone",
      });
      return;
    }

    const slots = await getAvailableSlots(
      date,
      timezone
    );

    res.status(200).json({
      success: true,
      date,
      timezone,
      slots,
    });
  } catch (error) {
    console.error("Availability error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch available slots",
    });
  }
};