"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Users, Fuel, Gauge, ShieldCheck } from "lucide-react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function CarDetailsPage() {
  const router = useRouter();
  const { id } = useParams();

  const { showToast } = useToast();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [booking, setBooking] = useState({
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await api.get(`/api/cars/${id}`);

      setCar(res.data.car);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Car not found
      </div>
    );
  }

  const features = [
    { icon: Users, label: "Seats", value: `${car.seats}` },
    { icon: Fuel, label: "Fuel", value: car.fuel },
    { icon: Gauge, label: "Mileage", value: car.mileage },
    { icon: ShieldCheck, label: "Transmission", value: car.transmission },
  ];
  const handleBooking = async () => {
    // 👇 Validation yaha
    if (
      !booking.pickupDate ||
      !booking.returnDate ||
      !booking.pickupLocation ||
      !booking.phone
    ) {
      showToast(
        "error",
        "Missing Information",
        "Please fill all required fields.",
      );
      return;
    }
    try {
      setBookingLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/bookings",
        {
          carId: car._id,
          pickupDate: booking.pickupDate,
          returnDate: booking.returnDate,
          pickupLocation: booking.pickupLocation,
          phone: booking.phone,
          notes: booking.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showToast(
        "success",
        "Booking Confirmed",
        res.data.message || "Your booking has been placed successfully.",
      );

      setBooking({
        pickupDate: "",
        returnDate: "",
        pickupLocation: "",
        phone: "",
        notes: "",
      });

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error: any) {
      console.log(error.response?.data || error);

      showToast(
        error.response?.data?.type || "error",
        error.response?.data?.title || "Booking Failed",
        error.response?.data?.message || "Something went wrong.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBooking((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="min-h-screen bg-[#030712] py-10">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex h-11 w-11 items-center cursor-pointer justify-center rounded-full bg-[#111827] text-orange-500 transition hover:bg-orange-500 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Main Layout — stacks on mobile, side by side on lg */}
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_460px]">
          {/* LEFT */}
          <section>
            {/* Car Image */}
            <div className="relative h-[260px] w-full overflow-hidden rounded-2xl bg-[#111827] sm:h-[320px] lg:h-[360px]">
              <Image
                src={car.images?.[0] || "/placeholder-car.png"}
                alt={car.name}
                fill
                priority
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            {/* Name & Price */}
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-orange-500 sm:text-4xl">
                {car.name}
              </h1>
              <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                ₹{car.price.toLocaleString("en-IN")}
                <span className="ml-2 text-base font-normal text-gray-400">
                  / day
                </span>
              </p>
            </div>

            {/* Feature Cards */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {features.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center p-4 gap-2 rounded-2xl bg-[#111827] py-5 text-center"
                >
                  <Icon size={24} className="text-orange-500" />
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT — Booking Form */}
          <aside>
            <div className="rounded-2xl border border-[#1f2937] bg-[#111827] p-6 shadow-2xl">
              <h2 className="text-3xl font-bold leading-tight text-white">
                Reserve <span className="text-orange-500">Your Drive</span>
              </h2>
              <p className="mt-1 text-md text-gray-400">Fast • Secure • Easy</p>

              {/* Dates */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-md text-gray-400">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={booking.pickupDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-[#1a2333] px-3 py-3 text-sm text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-md text-gray-400">
                    Return Date
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={booking.returnDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-[#1a2333] px-3 py-3 text-sm text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm text-gray-400">
                  Pickup Location
                </label>

                <input
                  type="text"
                  name="pickupLocation"
                  value={booking.pickupLocation}
                  onChange={handleChange}
                  placeholder="Enter pickup location"
                  className="w-full rounded-lg border border-gray-700 bg-[#1a2333] px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm text-gray-400">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={booking.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-700 bg-[#1a2333] px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm text-gray-400">
                  Notes (Optional)
                </label>

                <textarea
                  name="notes"
                  value={booking.notes}
                  onChange={handleChange}
                  placeholder="Any special request..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-700 bg-[#1a2333] px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>
              {/* Price Summary */}
              <div className="mt-5 rounded-xl bg-[#1a2333] px-4 py-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Rate/day</span>
                  <span>₹{car.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-2 flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span>₹{car.price.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="
mt-5
w-full
rounded-xl
bg-gradient-to-r
from-orange-500
to-orange-400
py-3
font-semibold
text-white
transition
disabled:cursor-not-allowed
disabled:opacity-70
hover:scale-[1.02]
"
              >
                {bookingLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Booking...</span>
                  </div>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
