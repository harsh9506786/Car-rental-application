import Coupon from "../models/Coupon.js";

// Runs once at server startup. Creates a 99.99%-off test coupon so the
// full Razorpay flow (order creation -> checkout -> signature verify)
// can be tested end-to-end for ~₹1 instead of real booking amounts.
// Safe to run on every restart - it only creates the coupon if missing.
export const ensureTestCoupon = async () => {
  try {
    const exists = await Coupon.findOne({ code: "TESTRIDE1" });

    if (!exists) {
      await Coupon.create({
        code: "TESTRIDE1",
        discountPercent: 99.99,
        active: true,
        description: "Testing coupon - brings any booking down to ~₹1",
      });

      console.log("🎟️  Test coupon TESTRIDE1 created (99.99% off)");
    }
  } catch (error) {
    console.log("Could not ensure test coupon:", error.message);
  }
};

export default ensureTestCoupon;