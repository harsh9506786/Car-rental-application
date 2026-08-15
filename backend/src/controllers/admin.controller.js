import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { autoExpireBookings } from "../utils/autoExpireBookings.js";

const ACTIVE_STATUSES = ["Pending", "Confirmed"];
const HISTORY_STATUSES = ["Completed", "Cancelled"];

export const getDashboardStats = async (req, res) => {
  try {
    await autoExpireBookings();

    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      stats: {
        totalCars,
        totalBookings,
        totalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentBookings = async (req, res) => {
  try {
    await autoExpireBookings();

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("car", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    await autoExpireBookings();

    const bookings = await Booking.find({
      status: { $in: ACTIVE_STATUSES },
    })
      .populate("user", "name email")
      .populate("car", "name brand")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingHistory = async (req, res) => {
  try {
    await autoExpireBookings();

    const bookings = await Booking.find({
      status: { $in: HISTORY_STATUSES },
    })
      .populate("user", "name email")
      .populate("car", "name brand")
      .sort({ returnDate: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};