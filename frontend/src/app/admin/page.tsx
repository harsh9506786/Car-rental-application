"use client";

import api from "@/lib/axios";
import StatCard from "@/components/admin/StatCard";
import DashboardSkeleton from "@/components/admin/DashboardSkeleton";

import { Car, CalendarDays, Users, IndianRupee } from "lucide-react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");

    const [statsRes, bookingsRes] = await Promise.all([
      api.get("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

      api.get("/api/admin/recent-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    return {
      stats: statsRes.data.stats,
      bookings: bookingsRes.data.bookings,
    };
  };

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/api/admin/booking/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      queryClient.setQueryData(["dashboard"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          bookings: old.bookings.map((booking: any) =>
            booking._id === id
              ? { ...booking, status }
              : booking,
          ),
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = data?.stats;

  const recentBookings = data?.bookings ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Welcome back, Admin 👋
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Cars"
          value={stats?.totalCars?.toString() ?? "0"}
          icon={Car}
        />

        <StatCard
          title="Bookings"
          value={stats?.totalBookings?.toString() ?? "0"}
          icon={CalendarDays}
        />

        <StatCard
          title="Users"
          value={stats?.totalUsers?.toString() ?? "0"}
          icon={Users}
        />

        <StatCard
          title="Revenue"
          value="Coming Soon"
          icon={IndianRupee}
        />
      </div>

      <div className="mt-8 rounded-2xl bg-[#111827] p-4 sm:p-6">
        <h2 className="mb-5 text-lg font-bold text-white sm:text-xl">
          Recent Bookings
        </h2>

        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <table className="min-w-[720px] w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="px-2 pb-3 text-sm whitespace-nowrap">
                  Customer
                </th>

                <th className="px-2 pb-3 text-sm whitespace-nowrap">
                  Car
                </th>

                <th className="px-2 pb-3 text-sm whitespace-nowrap">
                  Pickup
                </th>

                <th className="px-2 pb-3 text-sm whitespace-nowrap">
                  Return
                </th>

                <th className="px-2 pb-3 text-sm whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking: any) => (
                <tr
                  key={booking._id}
                  className="border-b border-gray-800"
                >
                  <td className="px-2 py-4 text-sm text-white whitespace-nowrap">
                    {booking.user?.name}
                  </td>

                  <td className="px-2 py-4 text-sm text-white whitespace-nowrap">
                    {booking.car?.name}
                  </td>

                  <td className="px-2 py-4 text-sm text-gray-300 whitespace-nowrap">
                    {new Date(
                      booking.pickupDate,
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-2 py-4 text-sm text-gray-300 whitespace-nowrap">
                    {new Date(
                      booking.returnDate,
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateStatus(
                          booking._id,
                          e.target.value,
                        )
                      }
                      className="rounded-lg border border-slate-700 bg-[#1F2937] px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Approved">
                        Approved
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}