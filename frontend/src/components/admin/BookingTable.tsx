"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Eye } from "lucide-react";
import Link from "next/link";
import TableSkeleton from "./TableSkeleton";

export default function BookingTable() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      setBookings(res.data.bookings);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <TableSkeleton rows={6} />;
  }
  return (
    <>
      {/* Desktop Table */}

      <div className="hidden overflow-hidden rounded-2xl border border-slate-700 bg-[#101826] md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#0B1120]">
              <tr className="text-left text-slate-300">
                <th className="p-4">Customer</th>
                <th className="p-4">Car</th>
                <th className="p-4">Pickup</th>
                <th className="p-4">Return</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-t border-slate-700 hover:bg-slate-800/40"
                >
                  <td className="p-4 text-white">{booking.user.name}</td>

                  <td className="p-4 text-slate-300">{booking.car.name}</td>

                  <td className="p-4 text-slate-300">
                    {new Date(booking.pickupDate).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-slate-300">
                    {new Date(booking.returnDate).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium
                    ${
                      booking.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center">
                      <Link
                        href={`/admin/bookings/${booking._id}`}
                        className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                      >
                        <Eye size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}

      <div className="space-y-4 md:hidden">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="rounded-2xl border border-slate-700 bg-[#101826] p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {booking.user.name}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium
              ${
                booking.status === "Pending"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-green-500/20 text-green-400"
              }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Car</span>

                <span className="font-medium text-white">
                  {booking.car.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Pickup</span>

                <span className="text-white">
                  {new Date(booking.pickupDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Return</span>

                <span className="text-white">
                  {new Date(booking.returnDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Link
              href={`/admin/bookings/${booking._id}`}
              className="
mt-5
flex
items-center
justify-center
gap-2
rounded-xl
bg-blue-500
py-3
font-medium
text-white
transition
hover:bg-blue-600
"
            >
              <Eye size={18} />
              View Details
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
