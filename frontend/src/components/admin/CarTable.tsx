"use client";

import api from "@/lib/axios";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import TableSkeleton from "./TableSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function CarTable() {
  const queryClient = useQueryClient();

  const fetchCars = async () => {
    const res = await api.get("/api/cars");
    return res.data.cars;
  };

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
    staleTime: 1000 * 60 * 5,
  });

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Car deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    } catch (error) {
      console.log(error);
      alert("Failed to delete car");
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={6} />;
  }

  if (cars.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-[#101826] py-16 text-center text-gray-500">
        No cars added yet.
      </div>
    );
  }

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {cars.map((car: any) => (
          <div
            key={car._id}
            className="rounded-2xl border border-slate-700 bg-[#101826] p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-white">{car.name}</p>
                <p className="text-sm text-slate-400">
                  {car.brand} · {car.category}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/cars/${car._id}`}
                  className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-slate-700 pt-3 text-sm">
              <div>
                <p className="text-slate-500">Price</p>
                <p className="text-slate-300">₹{car.price}/day</p>
              </div>
              <div>
                <p className="text-slate-500">Seats</p>
                <p className="text-slate-300">{car.seats}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-auto rounded-2xl border border-slate-700 bg-[#101826] sm:block">
        <table className="w-full min-w-[850px]">
          <thead className="bg-[#0B1120]">
            <tr className="text-left text-slate-300">
              <th className="p-4">Name</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Seats</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car: any) => (
              <tr
                key={car._id}
                className="border-t border-slate-700 hover:bg-slate-800/40"
              >
                <td className="p-4 text-white">{car.name}</td>
                <td className="p-4 text-slate-300">{car.brand}</td>
                <td className="p-4 text-slate-300">{car.category}</td>
                <td className="p-4 text-slate-300">₹{car.price}</td>
                <td className="p-4 text-slate-300">{car.seats}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <Link
                      href={`/admin/cars/${car._id}`}
                      className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(car._id)}
                      className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
