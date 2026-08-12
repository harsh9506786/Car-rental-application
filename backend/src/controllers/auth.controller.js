import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { autoExpireBookings } from "../utils/autoExpireBookings.js";
import { sendBookingConfirmed } from "../services/whatsapp.service.js";

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
const TERMINAL_STATUSES = ["Completed", "Cancelled"];

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Once a booking reaches a final state, it's locked - no further
    // status changes are allowed from anywhere (dashboard, bookings page,
    // or any direct API call), keeping every view in the app consistent.
    if (TERMINAL_STATUSES.includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `This booking is already ${booking.status.toLowerCase()} and cannot be changed further.`,
      });
    }

    booking.status = req.body.status;
    await booking.save();
    await booking.populate("car", "name brand");

    if (req.body.status === "Confirmed") {
      sendBookingConfirmed({
        phone: booking.phone,
        carName: booking.car?.name || "your car",
        pickupDate: booking.pickupDate,
      });
    }

    res.json({
      success: true,
      booking,
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
