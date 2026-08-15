"use client";
import Image from "next/image";
import { Users, Fuel, Gauge, ShieldCheck, ArrowRight } from "lucide-react";
import { useBookNow } from "@/hooks/useBookNow";

interface Props {
  car: any;
}

export default function CarCard({ car }: Props) {
  const handleBookNow = useBookNow(car._id);

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#070b14] transition duration-300 hover:shadow-[0_0_25px_rgba(255,140,0,0.3)]">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={car.images?.[0] || "/placeholder-car.png"}
          alt={car.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute left-5 top-5 rounded-full bg-orange-500 px-5 py-2 font-semibold text-white">
          ₹{car.price}/day
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <h2 className="min-h-[80px] text-3xl font-bold text-white">
            {car.name}
          </h2>

          <p className="mt-1 min-h-[28px] text-orange-400">{car.category}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-gray-300">
          <div className="flex items-center gap-2">
            <Users size={18} />
            {car.seats} Seats
          </div>

          <div className="flex items-center gap-2">
            <Fuel size={18} />
            {car.fuel}
          </div>

          <div className="flex items-center gap-2">
            <Gauge size={18} />
            {car.mileage}
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck size={18} />
            {car.transmission}
          </div>
        </div>

        <button
          onClick={handleBookNow}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 py-4 font-semibold text-white transition hover:scale-105 cursor-pointer"
        >
          Book Now
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
