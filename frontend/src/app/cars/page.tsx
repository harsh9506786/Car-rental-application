"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import CarCard from "@/components/cars/CarCard";
import CarCardSkeleton from "@/components/home/CarCardSkeleton";
import CustomSelect from "@/components/ui/CustomSelect";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { FaCarSide } from "react-icons/fa";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function CarsPage() {
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchCars = async () => {
    const res = await api.get("/api/cars");
    return res.data.cars;
  };

  const { data: cars = [], isLoading: loading } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
    staleTime: 1000 * 60 * 5, // 5 minutes — matches backend Redis TTL
  });

  const categories = useMemo(
    () =>
      Array.from(
        new Set(cars.map((c: any) => c.category).filter(Boolean)),
      ) as string[],
    [cars],
  );
  const fuelTypes = useMemo(
    () =>
      Array.from(
        new Set(cars.map((c: any) => c.fuel).filter(Boolean)),
      ) as string[],
    [cars],
  );
  const transmissions = useMemo(
    () =>
      Array.from(
        new Set(cars.map((c: any) => c.transmission).filter(Boolean)),
      ) as string[],
    [cars],
  );

  const categoryOptions = categories.map((c) => ({ value: c, label: c }));
  const fuelOptions = fuelTypes.map((f) => ({ value: f, label: f }));
  const transmissionOptions = transmissions.map((t) => ({
    value: t,
    label: t,
  }));

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c: any) =>
          c.name?.toLowerCase().includes(q) ||
          c.brand?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q),
      );
    }

    if (category) result = result.filter((c: any) => c.category === category);
    if (fuel) result = result.filter((c: any) => c.fuel === fuel);
    if (transmission)
      result = result.filter((c: any) => c.transmission === transmission);
    if (maxPrice)
      result = result.filter((c: any) => c.price <= Number(maxPrice));

    if (sort === "price_asc")
      result.sort((a: any, b: any) => a.price - b.price);
    else if (sort === "price_desc")
      result.sort((a: any, b: any) => b.price - a.price);
    else
      result.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    return result;
  }, [cars, search, category, fuel, transmission, maxPrice, sort]);

  const hasActiveFilters =
    search || category || fuel || transmission || maxPrice;

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setFuel("");
    setTransmission("");
    setMaxPrice("");
    setSort("newest");
  };

  return (
    <main className="min-h-screen bg-[#030712] pt-38 pb-20">
      <div className="mx-auto max-w-screen-xl px-6">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-orange-500">
            Premium Car Collection
          </h1>

          {/* Divider */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-[2px] w-20 bg-orange-400" />

            <FaCarSide className="text-orange-400" />

            <div className="h-[2px] w-20 bg-orange-400" />
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Discover our exclusive fleet of luxury vehicles. Each car is
            meticulously maintained and ready for your journey.
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="mb-8 rounded-2xl border border-gray-800 bg-[#070b14] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, brand, or category..."
                className="w-full rounded-xl border border-gray-800 bg-[#0B1120] py-3 pl-11 pr-4 text-white outline-none transition focus:border-orange-500"
              />
            </div>

            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                showFilters
                  ? "border-orange-500 bg-orange-500/10 text-orange-400"
                  : "border-gray-800 bg-[#0B1120] text-gray-300 hover:border-orange-500/50"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            <CustomSelect
              value={sort}
              onChange={setSort}
              options={SORT_OPTIONS}
              placeholder="Sort by"
              className="sm:w-56"
            />
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-800 pt-4 sm:grid-cols-4">
              <CustomSelect
                value={category}
                onChange={setCategory}
                options={categoryOptions}
                placeholder="All Categories"
              />

              <CustomSelect
                value={fuel}
                onChange={setFuel}
                options={fuelOptions}
                placeholder="All Fuel Types"
              />

              <CustomSelect
                value={transmission}
                onChange={setTransmission}
                options={transmissionOptions}
                placeholder="All Transmissions"
              />

              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max price/day"
                className="rounded-xl border border-gray-800 bg-[#0B1120] px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-orange-500"
              />
            </div>
          )}

          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-4">
              <p className="text-sm text-gray-400">
                {filteredCars.length} car
                {filteredCars.length !== 1 ? "s" : ""} found
              </p>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm font-semibold text-orange-400 hover:text-orange-300"
              >
                <X size={14} />
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredCars.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400">
              {hasActiveFilters
                ? "No cars match your filters. Try adjusting them."
                : "No cars available right now."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && filteredCars.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCars.map((car: any) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}