"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { useToast } from "@/context/ToastContext";

type Booking = {
  _id: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  phone: string;
  status: string;
};

interface Props {
  booking: Booking | null;
  onClose: () => void;
  onUpdated: () => void;
}

const toDateInputValue = (iso: string) =>
  new Date(iso).toISOString().split("T")[0];

export default function EditBookingModal({
  booking,
  onClose,
  onUpdated,
}: Props) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (booking) {
      setForm({
        pickupDate: toDateInputValue(booking.pickupDate),
        returnDate: toDateInputValue(booking.returnDate),
        pickupLocation: booking.pickupLocation,
        phone: booking.phone,
      });
    }
  }, [booking]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!booking) return;

    if (!form.pickupDate || !form.returnDate) {
      showToast(
        "warning",
        "Missing Dates",
        "Please select both pickup and return dates.",
      );
      return;
    }

    if (new Date(form.returnDate) < new Date(form.pickupDate)) {
      showToast(
        "warning",
        "Invalid Dates",
        "Return date cannot be before pickup date.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await api.put(`/api/bookings/${booking._id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showToast(
        res.data.type || "success",
        res.data.title || "Booking Updated",
        res.data.message || "Your booking has been updated.",
      );

      onUpdated();
      onClose();
    } catch (err: any) {
      const data = err?.response?.data;

      showToast(
        data?.type || "error",
        data?.title || "Update Failed",
        data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
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
            onClick={onClose}
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
              <h2 className="text-xl font-bold text-white">Edit Booking</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">
                  Pickup Date
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  min={todayStr}
                  value={form.pickupDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-700 bg-[#1a2333] px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">
                  Return Date
                </label>
                <input
                  type="date"
                  name="returnDate"
                  min={form.pickupDate || todayStr}
                  value={form.returnDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-700 bg-[#1a2333] px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm text-gray-400">
                Pickup Location
              </label>
              <input
                type="text"
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-[#1a2333] px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
              />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm text-gray-400">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-[#1a2333] px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 font-semibold text-white transition hover:scale-[1.01] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
