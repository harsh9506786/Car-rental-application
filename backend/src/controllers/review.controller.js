import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;

    if (!bookingId || !rating || !review) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Missing Information",
        message: "Please provide a rating and review.",
      });
    }

    const booking = await Booking.findById(bookingId).populate("car");

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
        message: "You can only review your own bookings.",
      });
    }

    if (booking.status !== "Completed") {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Cannot Review Yet",
        message:
          "You can only leave feedback after your rental is completed.",
      });
    }

    const existing = await Review.findOne({ booking: bookingId });
    if (existing) {
      return res.status(409).json({
        success: false,
        type: "error",
        title: "Already Reviewed",
        message: "You've already left feedback for this booking.",
      });
    }

    const newReview = await Review.create({
      user: req.user.id,
      booking: bookingId,
      car: booking.car._id,
      rating,
      review,
    });

    res.status(201).json({
      success: true,
      type: "success",
      title: "Thank You!",
      message: "Your feedback has been submitted.",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      type: "error",
      title: "Submission Failed",
      message: "Something went wrong. Please try again.",
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const reviews = await Review.find()
      .populate("user", "name")
      .populate("car", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};