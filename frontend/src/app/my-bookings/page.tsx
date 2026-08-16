"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  Phone,
  PackageOpen,
  Car as CarIcon,
  Pencil,
  History,
  Clock,
  CreditCard,
  Ban,
  MessageSquarePlus,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/axios";
import Spinner from "@/components/ui/Spinner";
import EditBookingModal from "@/components/bookings/EditBookingModal";
import PaymentModal from "@/components/bookings/PaymentModal";
import ReviewModal from "@/components/bookings/ReviewModal";

type Booking = {
  _id: string;
  car: {
    name: string;
    brand: string;
    images?: string[];
    price: number;
  };
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalPrice: number;
  pickupLocation: string;
  phone: string;
  notes?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid";
  hasReview?: boolean;
};

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Confirmed: "bg-green-500/10 text-green-400 border-green-500/30",
  Completed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
};

const EDITABLE_STATUSES = ["Pending", "Confirmed"];

function BookingImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-40 w-full shrink-0 items-center justify-center rounded-xl bg-[#1a2333] sm:h-auto sm:w-48">
        <CarIcon size={36} className="text-gray-600" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-40 w-full shrink-0 rounded-xl bg-[#1a2333] object-cover sm:h-auto sm:w-48"
    />
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyBookingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<"active" | "history">("active");
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(
    null,
  );

  useEffect(() => {
    const t = localStorage.getItem("token");

    if (!t) {
      router.replace("/login");
      return;
    }

    setToken(t);
  }, []);

  const fetchBookings = async (endpoint: string) => {
    const res = await api.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.bookings as Booking[];
  };

  const {
    data: activeBookings = [],
    isLoading: isActiveLoading,
    isError: isActiveError,
  } = useQuery({
    queryKey: ["my-bookings", "active"],
    queryFn: () => fetchBookings("/api/bookings"),
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: historyBookings = [],
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useQuery({
    queryKey: ["my-bookings", "history"],
    queryFn: () => fetchBookings("/api/bookings/history"),
    enabled: !!token && tab === "history",
    staleTime: 1000 * 60 * 2,
  });

  const isLoading = tab === "active" ? isActiveLoading : isHistoryLoading;
  const isError = tab === "active" ? isActiveError : isHistoryError;
  const bookings = tab === "active" ? activeBookings : historyBookings;

  const handleUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
  };
  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);

    try {
      await api.put(
        `/api/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    } catch (err) {
      console.log(err);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] py-10">
      <div className="mx-auto w-full max-w-5xl px-6 pt-20 sm:px-8 lg:px-12">
        <h1 className="mb-6 text-3xl font-bold text-white">
          My <span className="text-orange-500">Bookings</span>
        </h1>

        {/* Tabs */}
        <div className="mb-8 inline-flex rounded-xl border border-[#1f2937] bg-[#111827] p-1">
          <button
            onClick={() => setTab("active")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition ${
              tab === "active"
                ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Clock size={16} />
            Active
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition ${
              tab === "history"
                ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <History size={16} />
            History
          </button>
        </div>

        {isLoading && <Spinner />}

        {!isLoading && isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            Could not load your bookings. Please try again.
          </div>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#1f2937] bg-[#111827] py-20 text-center">
            <PackageOpen size={48} className="text-gray-600" />
            <p className="text-lg font-medium text-white">
              {tab === "active"
                ? "You have no active bookings"
                : "No booking history yet"}
            </p>
            <p className="text-sm text-gray-400">
              {tab === "active"
                ? "Browse our cars and book your first ride."
                : "Completed or cancelled bookings will show up here."}
            </p>
            {tab === "active" && (
              <button
                onClick={() => router.push("/cars")}
                className="mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 font-semibold text-white transition hover:scale-[1.02]"
              >
                Explore Cars
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col gap-5 rounded-2xl border border-[#1f2937] bg-[#111827] p-5 sm:flex-row"
              >
                <BookingImage
                  src={booking.car?.images?.[0]}
                  alt={booking.car?.name || "Car"}
                />

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {booking.car?.brand} {booking.car?.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-400">
                        Booking ID: {booking._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${
                          statusStyles[booking.status] ||
                          "border-gray-600 bg-gray-500/10 text-gray-300"
                        }`}
                      >
                        {booking.status}
                      </span>

                      {tab === "active" &&
                        booking.status === "Confirmed" &&
                        booking.paymentStatus === "Unpaid" && (
                          <button
                            onClick={() => setPayingBooking(booking)}
                            title="Pay now"
                            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-3 py-1.5 text-xs font-semibold text-white transition hover:scale-[1.03]"
                          >
                            <CreditCard size={13} />
                            Pay Now
                          </button>
                        )}

                      {tab === "active" &&
                        EDITABLE_STATUSES.includes(booking.status) && (
                          <button
                            onClick={() => setEditingBooking(booking)}
                            title="Edit booking"
                            className="flex items-center gap-1.5 rounded-full border border-[#1f2937] bg-[#1a2333] px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:border-orange-500/50 hover:text-orange-400"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                        )}

                      {tab === "active" && booking.status === "Confirmed" && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancellingId === booking._id}
                          title="Cancel booking"
                          className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-60"
                        >
                          <Ban size={13} />
                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}

                      {tab === "history" &&
                        booking.status === "Completed" &&
                        !booking.hasReview && (
                          <button
                            onClick={() => setReviewingBooking(booking)}
                            title="Leave feedback"
                            className="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/20"
                          >
                            <MessageSquarePlus size={13} />
                            Leave Feedback
                          </button>
                        )}

                      {tab === "history" &&
                        booking.status === "Completed" &&
                        booking.hasReview && (
                          <span className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                            <CheckCircle2 size={13} />
                            Reviewed
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-300 sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-orange-500" />
                      <span>
                        {formatDate(booking.pickupDate)} →{" "}
                        {formatDate(booking.returnDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-orange-500" />
                      <span>{booking.pickupLocation}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-orange-500" />
                      <span>{booking.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#1f2937] pt-4">
                    <span className="text-sm text-gray-400">
                      {booking.totalDays}{" "}
                      {booking.totalDays === 1 ? "day" : "days"}
                    </span>
                    <div className="flex items-center gap-2">
                      {booking.paymentStatus === "Paid" && (
                        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[10px] font-semibold text-green-400">
                          PAID
                        </span>
                      )}
                      <span className="text-lg font-bold text-white">
                        ₹{booking.totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EditBookingModal
        booking={editingBooking}
        onClose={() => setEditingBooking(null)}
        onUpdated={handleUpdated}
      />

      <PaymentModal
        booking={payingBooking}
        onClose={() => setPayingBooking(null)}
        onPaid={handleUpdated}
      />

      <ReviewModal
        booking={reviewingBooking}
        onClose={() => setReviewingBooking(null)}
        onSubmitted={handleUpdated}
      />
    </main>
  );
}