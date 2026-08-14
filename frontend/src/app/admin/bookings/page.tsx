"use client";

import api from "@/lib/axios";
import TableSkeleton from "@/components/admin/TableSkeleton";
import { useQuery } from "@tanstack/react-query";
import { Clock, History } from "lucide-react";
import { useState } from "react";

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
  Confirmed: "bg-green-500/10 text-green-400 border border-green-500/30",
  Completed: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  Cancelled: "bg-red-500/10 text-red-400 border border-red-500/30",
};

export default function BookingsPage() {
  const [tab, setTab] = useState<"active" | "history">("active");

  const fetchBookings = async (endpoint: string) => {
    const token = localStorage.getItem("token");
    const res = await api.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.bookings;
  };

  const { data: activeBookings = [], isLoading: isActiveLoading } = useQuery({
    queryKey: ["admin-bookings", "active"],
    queryFn: () => fetchBookings("/api/admin/bookings"),
    staleTime: 1000 * 60 * 5,
  });

  const { data: historyBookings = [], isLoading: isHistoryLoading } =
    useQuery({
      queryKey: ["admin-bookings", "history"],
      queryFn: () => fetchBookings("/api/admin/bookings/history"),
      enabled: tab === "history",
      staleTime: 1000 * 60 * 5,
    });

  const isLoading = tab === "active" ? isActiveLoading : isHistoryLoading;
  const bookings = tab === "active" ? activeBookings : historyBookings;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-white">Bookings</h1>

      <div className="mb-6 inline-flex rounded-xl border border-[#1f2937] bg-[#111827] p-1">
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

      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl bg-[#111827] py-16 text-center text-gray-500">
          {tab === "active"
            ? "No active bookings right now."
            : "No booking history yet."}
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {bookings.map((booking: any) => (
              <div
                key={booking._id}
                className="rounded-2xl border border-gray-800 bg-[#111827] p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">
                      {booking.user?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {booking.car?.name}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      statusStyles[booking.status] ||
                      "border border-gray-600 bg-gray-500/10 text-gray-300"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-800 pt-3 text-sm">
                  <div>
                    <p className="text-gray-500">Pickup</p>
                    <p className="text-gray-300">
                      {new Date(booking.pickupDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Return</p>
                    <p className="text-gray-300">
                      {new Date(booking.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-x-auto rounded-2xl bg-[#111827] p-6 sm:block">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Car</th>
                  <th className="pb-4">Pickup</th>
                  <th className="pb-4">Return</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: any) => (
                  <tr key={booking._id} className="border-b border-gray-800">
                    <td className="py-4 text-white">{booking.user?.name}</td>
                    <td className="py-4 text-gray-300">
                      {booking.car?.name}
                    </td>
                    <td className="py-4 text-gray-300">
                      {new Date(booking.pickupDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-300">
                      {new Date(booking.returnDate).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          statusStyles[booking.status] ||
                          "border border-gray-600 bg-gray-500/10 text-gray-300"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}