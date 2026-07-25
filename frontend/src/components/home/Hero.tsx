"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
// import AnimatedArc from "./AnimatedArc";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";

const heroImages = [
  "https://res.cloudinary.com/nlszpkhg/image/upload/f_auto,q_auto,w_1800/v1783762095/hero7_efepdu.webp",

  "https://res.cloudinary.com/nlszpkhg/image/upload/f_auto,q_auto,w_1800/v1783762081/hero12_x8r46k.webp",

  "https://res.cloudinary.com/nlszpkhg/image/upload/f_auto,q_auto,w_1800/v1783762059/hero13_qg7vno.webp",
];
export default function Hero() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      await Promise.all(
        heroImages.map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new window.Image();

              img.src = src;

              img.onload = async () => {
                try {
                  await img.decode();
                } catch {}

                resolve();
              };

              img.onerror = () => resolve();
            }),
        ),
      );

      setImagesLoaded(true);
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrent((prev) => (prev + 1) % heroImages.length),

    onSwipedRight: () =>
      setCurrent((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1)),

    trackMouse: true,
  });
  return (
    <section
      className="
    relative
    overflow-hidden
    pb-40
    md:pb-32
    lg:pb-0
"
    >
      {" "}
      {/* <AnimatedArc /> */}
      {/* Car Image */}
      <div
        className="
    relative
    mx-auto
    h-[540px]
    md:h-[630px]
    lg:h-[740px]
    w-full
    overflow-hidden
  "
      >
        <button
          onClick={() =>
            setCurrent(current === 0 ? heroImages.length - 1 : current - 1)
          }
          className="
absolute
left-4
top-1/2
z-20
hidden
-translate-y-1/2
rounded-full
bg-black/40
p-3
text-white
backdrop-blur-md
transition
hover:bg-orange-500
lg:flex
  "
        >
          <ChevronLeft size={28} />
        </button>
        <div {...handlers} className="absolute inset-0">
          {heroImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`Luxury Car ${index + 1}`}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
              sizes="100vw"
              className={`
    absolute
    inset-0
    object-cover
    object-center
    transition-opacity
    duration-700
    ease-in-out
    ${current === index ? "opacity-100 z-10" : "opacity-0 z-0"}
  `}
            />
          ))}
        </div>
        {/* Navbar Blend */}
        <div
          className="
    absolute
    inset-x-0
    top-0
    h-40
    bg-gradient-to-b
    from-black/80
    to-transparent
    pointer-events-none
  "
        />
        <button
          onClick={() => setCurrent((current + 1) % heroImages.length)}
          className="
   absolute
right-4
top-1/2
z-20
hidden
-translate-y-1/2
rounded-full
bg-black/40
p-3
text-white
backdrop-blur-md
transition
hover:bg-orange-500
lg:flex
  "
        >
          <ChevronRight size={28} />
        </button>
        {/* Dark Overlay */}
        <div
          className="
    absolute
    inset-0
    bg-black/25
    pointer-events-none
  "
        />

        {/* Premium Gradient Overlay */}
        <div
          className="
    absolute
    inset-0
    bg-gradient-to-b
    from-black/20
    via-transparent
    to-black/60
    pointer-events-none
  "
        />
      </div>
      {/* Floating Glass Card */}
      <div
        className="
        absolute
        left-1/2
       top-[380px]
md:top-[470px]
lg:top-[540px]
        z-20
        w-[92%]
        max-w-[650px]
        -translate-x-1/2
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-5
        backdrop-blur-xl

        md:p-6
        "
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500">DRIVEGO</p>

            <h2 className="mt-2 text-xl font-bold text-white">
              Next-gen fleet. Instant drive.
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Rent Your Dream Car. Transparent pricing. Book in seconds.
            </p>
          </div>

          <button
            onClick={() => router.push("/cars")}
            className="
    rounded-xl
    bg-gradient-to-r
    from-orange-400
    to-orange-500
    px-6
    py-3
    cursor-pointer
    font-semibold
    text-white
    shadow-[0_0_35px_rgba(251,146,60,0.6)]
    transition-all
    duration-300
    hover:scale-105
  "
          >
            See Fleet
          </button>
        </div>
      </div>
      <div
        className="
    absolute
    bottom-8
    left-1/2
    z-20
    flex
    -translate-x-1/2
    gap-3
  "
      >
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`
      h-3
      w-3
      rounded-full
      transition-all
      ${current === index ? "bg-orange-500 w-8" : "bg-white/40"}
    `}
          />
        ))}
      </div>
    </section>
  );
}
