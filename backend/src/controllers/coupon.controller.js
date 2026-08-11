import Coupon from "../models/Coupon.js";

export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code || !amount) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and amount are required.",
      });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      active: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired coupon code.",
      });
    }

    const discountedAmount = Math.max(
      1,
      Math.round(amount - (amount * coupon.discountPercent) / 100),
    );

    res.json({
      success: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      originalAmount: amount,
      discountedAmount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};