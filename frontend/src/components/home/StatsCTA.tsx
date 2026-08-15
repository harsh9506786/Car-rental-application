"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function StatsCTA() {
  const router = useRouter();
  const handleBooking = () => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/booking");
    } else {
      router.push("/login");
    }
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const fetchStats = async () => {
    const res = await api.get("/api/stats");
    return res.data.stats;
  };

  const { data: liveStats } = useQuery({
    queryKey: ["public-stats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5,
  });

  const stats = [
    {
      end: liveStats?.totalBookings ?? 0,
      suffix: "+",
      label: "Happy Customers",
      color: "text-cyan-400",
    },
    {
      end: liveStats?.totalCars ?? 0,
      suffix: "+",
      label: "Luxury Vehicles",
      color: "text-yellow-400",
    },
    {
      end: 24,
      suffix: "/7",
      label: "Support",
      color: "text-violet-400",
    },
    {
      end: liveStats?.totalLocations ?? 0,
      suffix: "+",
      label: "Pickup Locations",
      color: "text-emerald-400",
    },
  ];

  return (
    <section ref={ref} className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Stats */}
        <div
          className="
rounded-[32px]
border
border-slate-800
bg-gradient-to-r
from-slate-800
via-slate-900
to-[#08142f]
px-6
py-10
sm:mx-0
          "
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-10 text-center md:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label}>
                <h3
                  className={`text-3xl sm:text-4xl md:text-5xl font-bold ${item.color}`}
                >
                  {inView && <CountUp end={item.end} duration={2} />}
                  {item.suffix}
                </h3>

                <p className="mt-2 text-white">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative mt-12 overflow-hidden rounded-[40px]"
        >
          {/* Background */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#07111f]
              via-[#081a3b]
              to-[#07111f]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-[300px]
              w-[300px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-blue-500/10
              blur-[120px]
            "
          />

          <div className="relative px-6 py-20 text-center">
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              Ready for Your Premium Experience?
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-slate-400">
              Join thousands of satisfied customers who have experienced our
              premium fleet and exceptional service.
            </p>

            <motion.button
              onClick={handleBooking}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="
    mt-10
    rounded-full
    bg-gradient-to-r
    from-orange-500
    to-orange-600
    cursor-pointer
    px-10
    py-4
    text-lg
    font-semibold
    text-white
    shadow-[0_0_40px_rgba(249,115,22,0.5)]
  "
            >
              Book Your Luxury Ride
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}