import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  parentName: string;
  parentEmail: string;
  parentTimezone: string;

  studentName: string;
  studentAge: number;

  mentorId: mongoose.Types.ObjectId;

  startTimeUTC: Date;
  endTimeUTC: Date;

  status: "confirmed" | "cancelled";

  meetingLink: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    parentName: {
      type: String,
      required: true,
      trim: true,
    },

    parentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    parentTimezone: {
      type: String,
      required: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    studentAge: {
      type: Number,
      required: true,
      min: 6,
      max: 17,
    },

    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },

    startTimeUTC: {
      type: Date,
      required: true,
    },

    endTimeUTC: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },

    meetingLink: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({
  mentorId: 1,
  startTimeUTC: 1,
});

export const Booking = mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);