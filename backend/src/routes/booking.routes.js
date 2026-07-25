import express from "express";

import {
  createBooking,
  getBookings,
} from "../controllers/booking.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getBookings);
router.post("/", protect, createBooking);

export default router;
