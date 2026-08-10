import express from "express";

import {
  createBooking,
  getBookings,
  getBookingHistory,
  updateBooking,
} from "../controllers/booking.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getBookings);
router.get("/history", protect, getBookingHistory);
router.post("/", protect, createBooking);
router.put("/:id", protect, updateBooking);

export default router;