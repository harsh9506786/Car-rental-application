"use client";

import Image from "next/image";
import {
  FaUsers,
  FaGasPump,
  FaTachometerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { useBookNow } from "@/hooks/useBookNow";

type Props = {
  car: any;
};

export default function CarCard({ car }: Props) {
  const handleBookNow = useBookNow(car._id);

  return (
    <div
      className="
      group
      overflow-hidden
      rounded-[28px]
      border
      border-slate-800
      bg-black
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-orange-400/30
      "
    >
      {/* Image */}
      <div className="relative">
        <Image
          src={car.images?.[0] || "/placeholder-car.png"}
          alt={car.name}
          width={600}
          height={400}
          className="h-[250px] w-full object-cover"
        />

        <div
          className="
          absolute
          bottom-4
          right-4
          rounded-full
          bg-[#111827]
          px-4
          py-2
          text-orange-400
          font-semibold
          "
        >
          ₹{car.price?.toLocaleString("en-IN")}/day
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-3xl font-bold text-white">{car.name}</h3>

        <span
          className="
          mt-3
          inline-block
          rounded-full
          bg-[#111827]
          px-4
          py-1
          text-sm
          text-orange-400
          "
        >
          {car.category}
        </span>

        {/* Specs */}
        <div className="mt-8 grid grid-cols-4 gap-4 text-center">
          <div>
            <FaUsers className="mx-auto text-slate-400" />
            <p className="mt-2 text-white">{car.seats}</p>
          </div>

          <div>
            <FaGasPump className="mx-auto text-slate-400" />
            <p className="mt-2 text-white">{car.fuel}</p>
          </div>

          <div>
            <FaTachometerAlt className="mx-auto text-slate-400" />
            <p className="mt-2 text-white">{car.mileage}</p>
          </div>

          <div>
            <FaCheckCircle className="mx-auto text-slate-400" />
            <p className="mt-2 text-white">{car.transmission}</p>
          </div>
        </div>

        <button
          onClick={handleBookNow}
          className="
          mt-8
          w-full
          rounded-xl
          bg-gradient-to-r
          from-orange-400
          to-orange-500
          py-4
          text-lg
          font-semibold
          cursor-pointer
          text-white
          shadow-[0_0_30px_rgba(251,146,60,0.45)]
          transition-all
          duration-300
          hover:scale-[1.02]
          "
        >
          Book Now →
        </button>
      </div>
    </div>
  );
}
