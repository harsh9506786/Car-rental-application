"use client";

import api from "@/lib/axios";
import Spinner from "@/components/ui/Spinner";
import { useQuery } from "@tanstack/react-query";

export default function UsersPage() {
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.users;
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-white">Users</h1>

      {users.length === 0 ? (
        <div className="rounded-2xl bg-[#111827] py-16 text-center text-gray-500">
          No users yet.
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {users.map((user: any) => (
              <div
                key={user._id}
                className="rounded-2xl border border-gray-800 bg-[#111827] p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-sm break-all text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-orange-500 text-white"
                        : "bg-slate-700 text-gray-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-800 pt-3 text-sm">
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="text-gray-300">{user.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Joined</p>
                    <p className="text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
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
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Phone</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user._id} className="border-b border-gray-800">
                    <td className="py-4 text-white">{user.name}</td>
                    <td className="py-4 text-gray-300">{user.email}</td>
                    <td className="py-4 text-gray-300">{user.phone || "-"}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          user.role === "admin"
                            ? "bg-orange-500 text-white"
                            : "bg-slate-700 text-gray-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
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
