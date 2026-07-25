"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import CarCard from "@/components//cars/CarCard";

export default function CarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await api.get("/api/cars");
      setCars(res.data.cars);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Full page loader
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712]">
        <div
          className="
            h-14
            w-14
            animate-spin
            rounded-full
            border-4
            border-orange-400/20
            border-t-orange-400
          "
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] pt-38 pb-20">
      <div className="mx-auto max-w-screen-xl px-6">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-orange-500">
            Premium Car Collection
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Discover our exclusive fleet of luxury vehicles. Each car is
            meticulously maintained and ready for your journey.
          </p>
        </div>

        {/* Empty state */}
        {cars.length === 0 && (
          <p className="py-20 text-center text-gray-400">
            No cars available right now.
          </p>
        )}

        {/* Grid */}
        {cars.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}