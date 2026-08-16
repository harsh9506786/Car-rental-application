import Booking from "../models/Booking.js";

export const getEarnings = async (req, res) => {
  try {
    const payments = await Booking.find({ paymentStatus: "Paid" })
      .populate("user", "name email")
      .populate("car", "name brand")
      .sort({ updatedAt: -1 });

    const totalEarnings = payments.reduce(
      (sum, b) => sum + (b.paidAmount || 0),
      0,
    );

    res.json({
      success: true,
      count: payments.length,
      totalEarnings,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};