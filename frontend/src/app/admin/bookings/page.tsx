"use client";

import { useState } from "react";
import api from "@/lib/axios";
import TableSkeleton from "@/components/admin/TableSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, History } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
  Confirmed: "bg-green-500/10 text-green-400 border border-green-500/30",
  Completed: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  Cancelled: "bg-red-500/10 text-red-400 border border-red-500/30",
};

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [updatingId, setUpdatingId] = useState("");
  const [tab, setTab] = useState<"active" | "history">("active");

  const fetchBookings = async (endpoint: string) => {
    const token = localStorage.getItem("token");

    const res = await api.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);

    const token = localStorage.getItem("token");

    // Previous cache
    const previousBookings = queryClient.getQueryData(["admin-bookings", "active"]);

    // Instant UI Update
    queryClient.setQueryData(["admin-bookings", "active"], (old: any) =>
      old?.map((booking: any) =>
        booking._id === id ? { ...booking, status } : booking,
      ),
    );

    try {
      await api.put(
        `/api/admin/booking/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Completed/Cancelled bookings move to history, so refresh both lists
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    } catch (err: any) {
      console.log(err);

      showToast(
        "error",
        "Could Not Update Status",
        err?.response?.data?.message || "Something went wrong. Please try again.",
      );

      // Rollback if API fails
      queryClient.setQueryData(["admin-bookings", "active"], previousBookings);
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-white">Bookings</h1>

      {/* Tabs */}
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
      ) : (
        <div className="-mx-4 overflow-x-auto rounded-2xl bg-[#111827] p-4 sm:mx-0 sm:p-6">
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
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    {tab === "active"
                      ? "No active bookings right now."
                      : "No booking history yet."}
                  </td>
                </tr>
              )}

              {bookings.map((booking: any) => (
                <tr key={booking._id} className="border-b border-gray-800">
                  <td className="py-4 text-white">{booking.user?.name}</td>

                  <td className="py-4 text-gray-300">{booking.car?.name}</td>

                  <td className="py-4 text-gray-300">
                    {new Date(booking.pickupDate).toLocaleDateString()}
                  </td>

                  <td className="py-4 text-gray-300">
                    {new Date(booking.returnDate).toLocaleDateString()}
                  </td>

                  <td className="py-4">
                    {tab === "active" ? (
                      <select
                        value={booking.status}
                        disabled={updatingId === booking._id}
                        onChange={(e) =>
                          updateStatus(booking._id, e.target.value)
                        }
                        className="rounded-lg bg-[#1F2937] px-3 py-2 text-white outline-none disabled:opacity-60"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          statusStyles[booking.status] ||
                          "border border-gray-600 bg-gray-500/10 text-gray-300"
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}