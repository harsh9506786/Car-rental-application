"use client";

import { useState } from "react";
import api from "@/lib/axios";
import TableSkeleton from "@/components/admin/TableSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState("");

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/admin/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.bookings;
  };

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    staleTime: 1000 * 60 * 5,
  });

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);

    const token = localStorage.getItem("token");

    // Previous cache
    const previousBookings = queryClient.getQueryData(["bookings"]);

    // Instant UI Update
    queryClient.setQueryData(["bookings"], (old: any) =>
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
    } catch (err) {
      console.log(err);

      // Rollback if API fails
      queryClient.setQueryData(["bookings"], previousBookings);
    } finally {
      setUpdatingId("");
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={6} columns={5} />;
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-white">Bookings</h1>

      <div className="overflow-x-auto rounded-2xl bg-[#111827] p-6">
        <table className="w-full text-left">
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

                <td className="py-4 text-gray-300">{booking.car?.name}</td>

                <td className="py-4 text-gray-300">
                  {new Date(booking.pickupDate).toLocaleDateString()}
                </td>

                <td className="py-4 text-gray-300">
                  {new Date(booking.returnDate).toLocaleDateString()}
                </td>

                <td className="py-4">
                  <select
                    value={booking.status}
                    disabled={updatingId === booking._id}
                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                    className="rounded-lg bg-[#1F2937] px-3 py-2 text-white outline-none disabled:opacity-60"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
