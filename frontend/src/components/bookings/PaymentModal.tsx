"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, Tag, CreditCard, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";
import { useToast } from "@/context/ToastContext";

type Booking = {
  _id: string;
  totalPrice: number;
  car: {
    name: string;
    brand: string;
  };
};

interface Props {
  booking: Booking | null;
  onClose: () => void;
  onPaid: () => void;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function PaymentModal({ booking, onClose, onPaid }: Props) {
  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
  } | null>(null);
  const [paying, setPaying] = useState(false);

  if (!booking) return null;

  const finalAmount = appliedDiscount
    ? appliedDiscount.amount
    : booking.totalPrice;

  const resetState = () => {
    setCouponCode("");
    setAppliedDiscount(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setApplying(true);

    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/coupon/validate",
        { code: couponCode, amount: booking.totalPrice },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setAppliedDiscount({
        code: res.data.code,
        amount: res.data.discountedAmount,
      });

      showToast(
        "success",
        "Coupon Applied",
        `${res.data.discountPercent}% off applied.`,
      );
    } catch (err: any) {
      showToast(
        "error",
        "Invalid Coupon",
        err?.response?.data?.message || "This coupon code is not valid.",
      );
    } finally {
      setApplying(false);
    }
  };

  const handlePay = async () => {
    setPaying(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        showToast(
          "error",
          "Payment Unavailable",
          "Could not load payment gateway. Check your connection.",
        );
        setPaying(false);
        return;
      }

      const orderRes = await api.post(
        "/api/payment/create-order",
        {
          bookingId: booking._id,
          couponCode: appliedDiscount?.code || undefined,
        },
        { headers },
      );

      const { orderId, amount, keyId, carName } = orderRes.data;

      const razorpay = new window.Razorpay({
        key: keyId,
        amount: amount * 100,
        currency: "INR",
        name: "DriveGo",
        description: `Payment for ${carName}`,
        order_id: orderId,
        theme: { color: "#f97316" },
        handler: async (response: any) => {
          try {
            const verifyRes = await api.post(
              "/api/payment/verify",
              {
                bookingId: booking._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers },
            );

            showToast(
              verifyRes.data.type || "success",
              verifyRes.data.title || "Payment Successful",
              verifyRes.data.message || "Your payment was received.",
            );

            resetState();
            onPaid();
            onClose();
          } catch (err: any) {
            showToast(
              "error",
              "Verification Failed",
              err?.response?.data?.message ||
                "We received your payment but could not verify it. Contact support.",
            );
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });

      razorpay.open();
    } catch (err: any) {
      showToast(
        "error",
        "Payment Failed",
        err?.response?.data?.message || "Something went wrong. Please try again.",
      );
      setPaying(false);
    }
  };

  return (
    <AnimatePresence>
      {booking && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-1/2 z-[9999] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#0B1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,.55)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Complete Payment</h2>
              <button
                onClick={handleClose}
                className="rounded-full p-1.5 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="rounded-2xl border border-[#1f2937] bg-[#111827] p-4">
              <p className="text-sm text-gray-400">
                {booking.car.brand} {booking.car.name}
              </p>

              <div className="mt-2 flex items-end justify-between">
                <span className="text-sm text-gray-400">Amount</span>
                <div className="text-right">
                  {appliedDiscount && (
                    <p className="text-sm text-gray-500 line-through">
                      ₹{booking.totalPrice.toLocaleString("en-IN")}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-white">
                    ₹{finalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {appliedDiscount && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-400">
                  <CheckCircle2 size={14} />
                  Coupon &quot;{appliedDiscount.code}&quot; applied
                </div>
              )}
            </div>

            {!appliedDiscount && (
              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Tag
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400"
                  />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Have a coupon code?"
                    className="w-full rounded-xl border border-gray-700 bg-[#1a2333] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={applying || !couponCode.trim()}
                  className="rounded-xl border border-orange-500/50 px-4 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/10 disabled:opacity-50"
                >
                  {applying ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                </button>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={paying}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 font-semibold text-white transition hover:scale-[1.01] disabled:opacity-60"
            >
              {paying ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Pay ₹{finalAmount.toLocaleString("en-IN")}
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-gray-500">
              Secured by Razorpay
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}