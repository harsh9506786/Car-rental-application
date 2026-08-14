import express from "express";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";

import {
  getDashboardStats,
  getRecentBookings,
  getRecentUsers,
  getAllUsers,
  getAllBookings,
  getBookingHistory,
} from "../controllers/admin.controller.js";



const router = express.Router();

// Dashboard
router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/recent-bookings", protect, adminOnly, getRecentBookings);
router.get("/recent-users", protect, adminOnly, getRecentUsers);

// Bookings
router.get("/bookings", protect, adminOnly, getAllBookings);
router.get("/bookings/history", protect, adminOnly, getBookingHistory);

// Users
router.get("/users", protect, adminOnly, getAllUsers);

export default router;