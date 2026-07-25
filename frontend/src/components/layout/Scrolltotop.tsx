"use client";

import { ArrowUp } from "lucide-react";
import useScrollVisibility from "@/hooks/useScrollVisibility";

export default function Scrolltotop() {
  const visible = useScrollVisibility();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed
        scroll-top-btn
        bottom-8
        right-8
        z-[9999]
        h-14
        w-14
        cursor-pointer
        rounded-full
        bg-orange-500
        text-white
        shadow-xl
        transition-all
        duration-300
        hover:scale-110
        hover:bg-orange-600
        z-10
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-5 pointer-events-none"
        }
      `}
    >
      <ArrowUp className="mx-auto h-6 w-6" />
    </button>
  );
}
