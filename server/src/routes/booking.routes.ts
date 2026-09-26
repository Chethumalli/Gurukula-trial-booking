import { Router } from "express";
import { createBookingController } from "../controllers/booking.controller.js";

const router = Router();

router.post("/", createBookingController);

export default router;