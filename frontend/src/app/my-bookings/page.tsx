"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Phone, PackageOpen, Car as CarIcon } from "lucide-react";
import api from "@/lib/axios";
import BookingCardSkeleton from "@/components/bookings/BookingCardSkeleton";

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
};

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Confirmed: "bg-green-500/10 text-green-400 border-green-500/30",
  Completed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
};

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

export default function MyBookingsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");

    if (!t) {
      router.replace("/login");
      return;
    }

    setToken(t);
  }, []);

  const fetchBookings = async () => {
    const res = await api.get("/api/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.bookings as Booking[];
  };

  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: fetchBookings,
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
  });

  return (
    <main className="min-h-screen bg-[#030712] py-10">
      <div className="mx-auto w-full max-w-5xl px-6 pt-20 sm:px-8 lg:px-12">
        <h1 className="mb-8 text-3xl font-bold text-white">
          My <span className="text-orange-500">Bookings</span>
        </h1>

        {isLoading && (
          <div className="space-y-5">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        )}

        {!isLoading && isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            Could not load your bookings. Please try again.
          </div>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#1f2937] bg-[#111827] py-20 text-center">
            <PackageOpen size={48} className="text-gray-600" />
            <p className="text-lg font-medium text-white">
              You have no bookings yet
            </p>
            <p className="text-sm text-gray-400">
              Browse our cars and book your first ride.
            </p>
            <button
              onClick={() => router.push("/cars")}
              className="mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 font-semibold text-white transition hover:scale-[1.02]"
            >
              Explore Cars
            </button>
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

                    <span
                      className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${
                        statusStyles[booking.status] ||
                        "border-gray-600 bg-gray-500/10 text-gray-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-300 sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-orange-500" />
                      <span>
                        {new Date(booking.pickupDate).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}{" "}
                        →{" "}
                        {new Date(booking.returnDate).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
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
                    <span className="text-lg font-bold text-white">
                      ₹{booking.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}