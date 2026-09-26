import mongoose from "mongoose";
import dotenv from "dotenv";
import { Mentor } from "../models/Mentor.js";

dotenv.config();

const mentors = [
  {
    name: "Aarav Sharma",
    email: "aarav@codeyoung.com",
    timezone: "Asia/Kolkata",
    isActive: true,
    maxDailyBookings: 2,
  },
  {
    name: "Ananya Rao",
    email: "ananya@codeyoung.com",
    timezone: "Asia/Kolkata",
    isActive: true,
    maxDailyBookings: 2,
  },
  {
    name: "Rahul Nair",
    email: "rahul@codeyoung.com",
    timezone: "Asia/Kolkata",
    isActive: true,
    maxDailyBookings: 2,
  },
  {
    name: "Priya Menon",
    email: "priya@codeyoung.com",
    timezone: "Asia/Kolkata",
    isActive: true,
    maxDailyBookings: 2,
  },

  {
    name: "Vikram Singh",
    email: "vikram@codeyoung.com",
    timezone: "Europe/London",
    isActive: true,
    maxDailyBookings: 2,
  },
  {
    name: "Sneha Patel",
    email: "sneha@codeyoung.com",
    timezone: "Europe/London",
    isActive: true,
    maxDailyBookings: 2,
  },
  {
    name: "Arjun Kumar",
    email: "arjun@codeyoung.com",
    timezone: "Europe/London",
    isActive: true,
    maxDailyBookings: 2,
  },

  {
    name: "Meera Iyer",
    email: "meera@codeyoung.com",
    timezone: "America/New_York",
    isActive: true,
    maxDailyBookings: 2,
  },
  {
    name: "Karan Joshi",
    email: "karan@codeyoung.com",
    timezone: "America/New_York",
    isActive: true,
    maxDailyBookings: 2,
  },
  {
    name: "Riya Kapoor",
    email: "riya@codeyoung.com",
    timezone: "America/New_York",
    isActive: true,
    maxDailyBookings: 2,
  },
];

const seedMentors = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(mongoUri, {
      family: 4,
    });

    console.log("✅ MongoDB connected");

    await Mentor.deleteMany({});

    await Mentor.insertMany(mentors);

    console.log("✅ 10 mentors inserted successfully");

    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  } catch (error) {
    console.error("❌ Error seeding mentors:", error);
    process.exit(1);
  }
};

seedMentors();