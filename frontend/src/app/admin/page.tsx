"use client";

import api from "@/lib/axios";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/ui/Spinner";
import { Car, CalendarDays, Users, IndianRupee } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
  Confirmed: "bg-green-500/10 text-green-400 border border-green-500/30",
  Completed: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  Cancelled: "bg-red-500/10 text-red-400 border border-red-500/30",
};

export default function AdminDashboard() {
  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");

    const [statsRes, bookingsRes] = await Promise.all([
      api.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      api.get("/api/admin/recent-bookings", {
        headers: { Authorization: `Bearer ${token}` },
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

  if (isLoading) {
    return <Spinner />;
  }

  const stats = data?.stats;
  const recentBookings = data?.bookings ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-400">Welcome back, Admin 👋</p>
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
        <StatCard title="Revenue" value="Coming Soon" icon={IndianRupee} />
      </div>

      <div className="mt-8 rounded-2xl bg-[#111827] p-4 sm:p-6">
        <h2 className="mb-5 text-lg font-bold text-white sm:text-xl">
          Recent Bookings
        </h2>

        {recentBookings.length === 0 && (
          <p className="py-10 text-center text-gray-500">No recent bookings.</p>
        )}

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-3 sm:hidden">
          {recentBookings.map((booking: any) => (
            <div
              key={booking._id}
              className="rounded-xl border border-gray-800 bg-[#0B1120] p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white">
                    {booking.user?.name}
                  </p>
                  <p className="text-sm text-gray-400">{booking.car?.name}</p>
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
        {recentBookings.length > 0 && (
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="px-2 pb-3 text-sm whitespace-nowrap">
                    Customer
                  </th>
                  <th className="px-2 pb-3 text-sm whitespace-nowrap">Car</th>
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
                  <tr key={booking._id} className="border-b border-gray-800">
                    <td className="px-2 py-4 text-sm whitespace-nowrap text-white">
                      {booking.user?.name}
                    </td>
                    <td className="px-2 py-4 text-sm whitespace-nowrap text-white">
                      {booking.car?.name}
                    </td>
                    <td className="px-2 py-4 text-sm whitespace-nowrap text-gray-300">
                      {new Date(booking.pickupDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-4 text-sm whitespace-nowrap text-gray-300">
                      {new Date(booking.returnDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-4">
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
        )}
      </div>
    </div>
  );
}
