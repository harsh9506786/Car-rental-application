"use client";

import { motion } from "framer-motion";

import { FaCarSide } from "react-icons/fa";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonials";

export default function Testimonials() {
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
            Hear from our valued customers about their journey with our premium
            fleet
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="
    mt-20
    grid
    grid-cols-1
    gap-8
    md:grid-cols-2
    xl:grid-cols-3
  "
        >
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <TestimonialCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
