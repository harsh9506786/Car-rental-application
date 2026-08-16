import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Booking from "../models/Booking.js";
import Coupon from "../models/Coupon.js";
import Notification from "../models/Notification.js";

// Creates a Razorpay order for a booking. Only allowed once the booking
// has been Confirmed by an admin, and only for the booking's own owner.
// If a coupon code is passed, the discount is recalculated server-side
// (never trust the amount coming from the client) before creating the order.
export const createOrder = async (req, res) => {
  try {
    const { bookingId, couponCode } = req.body;

    const booking = await Booking.findById(bookingId).populate("car");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only pay for your own bookings.",
      });
    }

    if (booking.status !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message:
          "Payment is only available once your booking has been confirmed by the team.",
      });
    }

    if (booking.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This booking has already been paid for.",
      });
    }

    let amount = booking.totalPrice;
    let appliedCoupon = "";

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        active: true,
      });

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired coupon code.",
        });
      }

      amount = Math.max(
        1,
        Math.round(amount - (amount * coupon.discountPercent) / 100),
      );
      appliedCoupon = coupon.code;
    }

    // Razorpay expects the amount in the smallest currency unit (paise)
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
      },
    });

    booking.razorpayOrderId = order.id;
    booking.couponApplied = appliedCoupon;
    await booking.save();

    res.json({
      success: true,
      orderId: order.id,
      amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: booking._id,
      carName: `${booking.car.brand} ${booking.car.name}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verifies the Razorpay payment signature and marks the booking as paid.
// This is the step that actually confirms money changed hands - never
// trust a "payment success" message from the frontend without this check.
export const verifyPayment = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not allowed.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Payment Verification Failed",
        message: "We could not verify this payment. Please contact support.",
      });
    }

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    booking.paymentStatus = "Paid";
    booking.paidAmount = Number(razorpayOrder.amount) / 100;
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.paymentMethod = paymentDetails.method || "unknown";
    await booking.save();

    await Notification.create({
      title: "Payment Received",
      message: `Payment of ₹${booking.paidAmount} received for a booking`,
      type: "booking",
    });

    res.json({
      success: true,
      type: "success",
      title: "Payment Successful",
      message: "Your payment was received. Enjoy your ride!",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      type: "error",
      title: "Verification Failed",
      message: "Something went wrong while verifying your payment.",
    });
  }
};