"use client";

import CarCard from "./FeaturedCarCard";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { FaCarSide } from "react-icons/fa";
import CarCardSkeleton from "./CarCardSkeleton";

interface Car {
  _id: string;
  name: string;
  images: string[];
  price: number;
  category: string;
  seats: number;
  fuel: string;
  mileage: string;
  transmission: string;
}

export default function CarCollection() {
  const fetchCars = async () => {
    const res = await api.get("/api/cars");
    return res.data.cars as Car[];
  };

  const { data: cars = [], isLoading: loading } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Badge */}
        <div>
          {/* Badge */}
          <div className="flex justify-center">
            <div
              className="
      rounded-full
      border
      border-slate-700
      bg-[#0f172a]
      px-6
      py-2
      text-orange-400
      "
            >
              Premium Fleet Selection
            </div>
          </div>

          {/* Heading */}
          <h2
            className="
    mt-8
    text-center
    text-4xl
    md:text-6xl
    font-bold
    text-orange-400
    "
          >
            Luxury Car Collection
          </h2>
          {/* Divider */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-[2px] w-20 bg-orange-400" />

            <FaCarSide className="text-orange-400" />

            <div className="h-[2px] w-20 bg-orange-400" />
          </div>

          <p
            className="
    mx-auto
    mt-6
    max-w-3xl
    text-center
    text-slate-400
    "
          >
            Discover premium vehicles with exceptional performance and comfort
            for your next journey
          </p>
        </div>

        {loading && (
          <div
            className="
      mt-20
      grid
      grid-cols-1
      gap-8
      md:grid-cols-2
      xl:grid-cols-3
    "
          >
            {[...Array(6)].map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Empty state (optional) */}
        {!loading && cars.length === 0 && (
          <p className="mt-20 text-center text-slate-400">
            No cars available right now.
          </p>
        )}

        {/* Grid */}
        {!loading && cars.length > 0 && (
          <div
            className="
      mt-20
      grid
      grid-cols-1
      gap-8
      md:grid-cols-2
      xl:grid-cols-3
    "
          >
            {cars.map((car) => (
              <div key={car._id}>
                <CarCard car={car} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}