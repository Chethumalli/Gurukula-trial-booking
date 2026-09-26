import mongoose, { Document, Schema } from "mongoose";

export interface IMentor extends Document {
  name: string;
  email: string;
  timezone: string;
  isActive: boolean;
  maxDailyBookings: number;
}

const mentorSchema = new Schema<IMentor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    timezone: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    maxDailyBookings: {
      type: Number,
      default: 2,
    },
  },
  {
    timestamps: true,
  }
);

export const Mentor = mongoose.model<IMentor>("Mentor", mentorSchema);