"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import api from "@/lib/axios";
import { useToast } from "@/context/ToastContext";

type Props = {
  booking: any;
  onClose: () => void;
  onSubmitted: () => void;
};

export default function ReviewModal({ booking, onClose, onSubmitted }: Props) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  const handleSubmit = async () => {
    if (rating === 0 || !review.trim()) {
      showToast(
        "error",
        "Missing Information",
        "Please give a rating and write your feedback.",
      );
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/reviews",
        { bookingId: booking._id, rating, review },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      showToast("success", res.data.title, res.data.message);

      setRating(0);
      setReview("");
      onSubmitted();
      onClose();
    } catch (error: any) {
      showToast(
        error.response?.data?.type || "error",
        error.response?.data?.title || "Submission Failed",
        error.response?.data?.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1f2937] bg-[#111827] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Leave Feedback</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-400">
          How was your experience with {booking.car?.brand} {booking.car?.name}?
        </p>

        {/* Star rating */}
        <div className="mb-5 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition"
            >
              <Star
                size={32}
                className={
                  star <= (hoverRating || rating)
                    ? "fill-orange-400 text-orange-400"
                    : "text-gray-600"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Tell us about your experience..."
          rows={4}
          maxLength={500}
          className="w-full rounded-lg border border-gray-700 bg-[#1a2333] px-4 py-3 text-white outline-none focus:border-orange-500"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 hover:scale-[1.02]"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}