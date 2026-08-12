"use client";

import api from "@/lib/axios";
import TableSkeleton from "@/components/admin/TableSkeleton";
import { useQuery } from "@tanstack/react-query";

export default function UsersPage() {
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.users;
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  if (isLoading) {
    return <TableSkeleton rows={6} columns={5} />;
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-white">Users</h1>

      <div className="-mx-4 overflow-x-auto rounded-2xl bg-[#111827] p-4 sm:mx-0 sm:p-6">
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
    </div>
  );
}
