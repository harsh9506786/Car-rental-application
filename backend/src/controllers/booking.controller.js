import User from "../models/User.js";
import {
  sendBookingConfirmation,
  sendBookingCancellation,
} from "../services/email.service.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import Notification from "../models/Notification.js";
import { autoExpireBookings } from "../utils/autoExpireBookings.js";
import redisClient from "../config/redis.js";
import Review from "../models/Review.js";

const ACTIVE_STATUSES = ["Pending", "Confirmed"];
const HISTORY_STATUSES = ["Completed", "Cancelled"];

// Statuses that "hold" a car's dates and should block overlapping bookings
const BLOCKING_STATUSES = ["Pending", "Confirmed"];

export const createBooking = async (req, res) => {
  const lockKey = `lock:car:${req.body.carId}`;
  let lockAcquired = false;

  try {
    const car = await Car.findById(req.body.carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        type: "error",
        title: "Car Not Found",
        message: "The selected car does not exist.",
      });
    }

    // Acquire a short-lived lock so two overlapping requests for the same
    // car can't both pass the availability check at the same time.
    if (redisClient.isOpen) {
      lockAcquired = await redisClient.set(lockKey, "1", {
        NX: true,
        EX: 10, // auto-expires in 10s in case something crashes mid-request
      });

      if (!lockAcquired) {
        return res.status(409).json({
          success: false,
          type: "error",
          title: "Please Try Again",
          message:
            "This car is being booked by someone else right now. Please try again in a moment.",
        });
      }
    }

    const pickupDate = new Date(req.body.pickupDate);
    const returnDate = new Date(req.body.returnDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(pickupDate) || isNaN(returnDate)) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Invalid Dates",
        message: "Please provide valid pickup and return dates.",
      });
    }

    if (pickupDate < today) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Invalid Dates",
        message: "Pickup date cannot be in the past.",
      });
    }

    if (returnDate < pickupDate) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Invalid Dates",
        message: "Return date cannot be before pickup date.",
      });
    }
    const totalDays = Math.max(
      1,
      Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)),
    );

    const totalPrice = totalDays * car.price;

    const existingBooking = await Booking.findOne({
      car: car._id,

      status: {
        $in: BLOCKING_STATUSES,
      },

      pickupDate: {
        $lte: returnDate,
      },

      returnDate: {
        $gte: pickupDate,
      },
    });
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Car Already Booked",
        message: "Please choose another car.",
      });
    }

    const booking = await Booking.create({
      user: req.user.id,

      car: car._id,

      pickupDate,
      returnDate,

      totalDays,
      totalPrice,

      pickupLocation: req.body.pickupLocation,

      phone: req.body.phone,

      notes: req.body.notes,
    });

    await Notification.create({
      title: "New Booking",
      message: `${req.user.name} booked ${car.name}`,
      type: "booking",
      bookingId: booking._id,
    });

    // Fire-and-forget: don't block the response on the email send
    const bookingUser = await User.findById(req.user.id);
    if (bookingUser?.email) {
      sendBookingConfirmation({
        to: bookingUser.email,
        userName: bookingUser.name,
        carName: car.name,
        pickupDate,
        returnDate,
        totalPrice,
        pickupLocation: req.body.pickupLocation,
      });
    }

    res.status(201).json({
      success: true,
      type: "success",
      title: "Booking Confirmed",
      message: "Your booking has been confirmed.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      type: "error",
      title: "Booking Failed",
      message: "Something went wrong. Please try again.",
    });
  } finally {
    if (lockAcquired && redisClient.isOpen) {
      await redisClient.del(lockKey);
    }
  }
};

export const getBookings = async (req, res) => {
  try {
    await autoExpireBookings();

    const bookings = await Booking.find({
      user: req.user.id,
      status: { $in: ACTIVE_STATUSES },
    })
      .populate("user", "name email")
      .populate("car", "name brand images price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
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
      user: req.user.id,
      status: { $in: HISTORY_STATUSES },
    })
      .populate("user", "name email")
      .populate("car", "name brand images price")
      .sort({ returnDate: -1 });

    const bookingIds = bookings.map((b) => b._id);
    const reviews = await Review.find({
      booking: { $in: bookingIds },
    }).select("booking");
    const reviewedIds = new Set(reviews.map((r) => r.booking.toString()));

    const bookingsWithReviewFlag = bookings.map((b) => ({
      ...b.toObject(),
      hasReview: reviewedIds.has(b._id.toString()),
    }));

    res.json({
      success: true,
      count: bookingsWithReviewFlag.length,
      bookings: bookingsWithReviewFlag,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("car");

    if (!booking) {
      return res.status(404).json({
        success: false,
        type: "error",
        title: "Booking Not Found",
        message: "This booking does not exist.",
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        type: "error",
        title: "Not Allowed",
        message: "You can only edit your own bookings.",
      });
    }

    if (!ACTIVE_STATUSES.includes(booking.status)) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Cannot Edit",
        message: `This booking is ${booking.status.toLowerCase()} and can no longer be edited.`,
      });
    }

    const pickupDate = new Date(req.body.pickupDate);
    const returnDate = new Date(req.body.returnDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(pickupDate) || isNaN(returnDate)) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Invalid Dates",
        message: "Please provide valid pickup and return dates.",
      });
    }

    if (pickupDate < today) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Invalid Dates",
        message: "Pickup date cannot be in the past.",
      });
    }

    if (returnDate < pickupDate) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Invalid Dates",
        message: "Return date cannot be before pickup date.",
      });
    }

    const overlapping = await Booking.findOne({
      _id: { $ne: booking._id },
      car: booking.car._id,
      status: { $in: BLOCKING_STATUSES },
      pickupDate: { $lte: returnDate },
      returnDate: { $gte: pickupDate },
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Car Already Booked",
        message: "This car is not available for the selected dates.",
      });
    }

    const totalDays = Math.max(
      1,
      Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)),
    );

    booking.pickupDate = pickupDate;
    booking.returnDate = returnDate;
    booking.totalDays = totalDays;
    booking.totalPrice = totalDays * booking.car.price;

    if (req.body.pickupLocation) {
      booking.pickupLocation = req.body.pickupLocation;
    }

    if (req.body.phone) {
      booking.phone = req.body.phone;
    }

    await booking.save();

    res.json({
      success: true,
      type: "success",
      title: "Booking Updated",
      message: "Your booking has been updated.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      type: "error",
      title: "Update Failed",
      message: "Something went wrong. Please try again.",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        type: "error",
        title: "Booking Not Found",
        message: "This booking does not exist.",
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        type: "error",
        title: "Not Allowed",
        message: "You can only cancel your own bookings.",
      });
    }

    if (booking.status !== "Confirmed") {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Cannot Cancel",
        message: `This booking is already ${booking.status.toLowerCase()} and cannot be cancelled.`,
      });
    }

    booking.status = "Cancelled";
    await booking.save();

    // Fire-and-forget: don't block the response on the email send
    const cancelUser = await User.findById(req.user.id);
    const bookedCar = await Car.findById(booking.car);
    if (cancelUser?.email) {
      sendBookingCancellation({
        to: cancelUser.email,
        userName: cancelUser.name,
        carName: bookedCar?.name || "your car",
        pickupDate: booking.pickupDate,
      });
    }

    res.json({
      success: true,
      type: "success",
      title: "Booking Cancelled",
      message: "Your booking has been cancelled.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      type: "error",
      title: "Cancel Failed",
      message: "Something went wrong. Please try again.",
    });
  }
};