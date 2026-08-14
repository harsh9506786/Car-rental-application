"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { FaCarSide } from "react-icons/fa";
import TestimonialCard from "./TestimonialCard";
import api from "@/lib/axios";

export default function Testimonials() {
  const fetchReviews = async () => {
    const res = await api.get("/api/reviews?limit=12");
    return res.data.reviews;
  };

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    staleTime: 1000 * 60 * 5,
  });

  const testimonials = reviews.map((r: any) => ({
    id: r._id,
    name: r.user?.name || "Verified Renter",
    role: "Verified Renter",
    vehicle: r.car?.name || "DriveGo Fleet",
    rating: r.rating,
    avatar: (r.user?.name?.[0] || "D").toUpperCase(),
    review: r.review,
  }));

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  if (testimonials.length === 0) {
    return null;
  }

  const shouldSlide = testimonials.length > 3;
  const marqueeItems = shouldSlide
    ? [...testimonials, ...testimonials]
    : testimonials;

  return (
    <section className="pt-5 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center">
            <div
              className="
            rounded-full
            border
            border-slate-700
            bg-[#101827]
            px-6
            py-2
            text-orange-400
            "
            >
              Customer Experiences
            </div>
          </div>

          {/* Heading */}
          <h2
            className="
          mt-8
          text-center
          text-4xl
          font-bold
          text-orange-400
          md:text-6xl
          "
          >
            Premium Drive Experiences
          </h2>

          {/* Divider */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-[2px] w-20 bg-orange-400" />

            <FaCarSide className="text-orange-400" />

            <div className="h-[2px] w-20 bg-orange-400" />
          </div>

          <p
            className="
          mx-auto
          mt-8
          max-w-3xl
          text-center
          text-lg
          text-slate-400
          "
          >
            Hear from our valued customers about their journey with our
            premium fleet
          </p>
        </motion.div>

        {/* Static grid (3 or fewer reviews) */}
        {!shouldSlide && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {testimonials.map((item: any) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <TestimonialCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Auto-sliding marquee (more than 3 reviews) */}
        {shouldSlide && (
          <div className="mt-20 overflow-x-auto sm:overflow-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="animate-marquee flex w-max gap-5 px-4 sm:gap-8 sm:px-0">
              {marqueeItems.map((item: any, index: number) => (
                <div
                  key={`${item.id}-${index}`}
                  className="w-[260px] shrink-0 xs:w-[280px] sm:w-[360px]"
                >
                  <TestimonialCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}