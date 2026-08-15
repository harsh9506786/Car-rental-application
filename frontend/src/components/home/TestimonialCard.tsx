import {
  FaQuoteLeft,
  FaStar,
  FaCarSide,
} from "react-icons/fa";

type Props = {
  item: any;
};

export default function TestimonialCard({ item }: Props) {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-[32px]
      bg-[#101018]
      p-8
      border
      border-slate-800
      transition-all
      duration-300
      hover:-translate-y-2
      "
    >
      {/* Corner Accent */}
      <div
        className="
        absolute
        right-0
        top-0
        h-8
        w-8
        bg-orange-900/60
        clip-path-triangle
        "
      />

      {/* Top */}
      <div className="flex items-center justify-between pr-2">
        <FaQuoteLeft className="text-4xl text-orange-400" />

        <div className="mt-3 flex gap-1">
          {[...Array(item.rating)].map((_, i) => (
            <FaStar
              key={i}
              className="text-orange-400"
            />
          ))}
        </div>
      </div>

      {/* Review */}
      <p
        className="
        mt-8
        text-lg
        italic
        leading-relaxed
        text-slate-300
        "
      >
        "{item.review}"
      </p>

      {/* Vehicle */}
      <div
        className="
        mt-8
        flex
        items-center
        gap-3
        rounded-2xl
        bg-[#171d2d]
        p-4
        "
      >
        <FaCarSide className="text-orange-400" />

        <span className="font-semibold text-orange-400">
          {item.vehicle}
        </span>
      </div>

      {/* User */}
      <div className="mt-8 flex items-center gap-4">
        <div
          className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-orange-500
          text-2xl
          font-bold
          text-white
          "
        >
          {item.avatar}
        </div>

        <div>
          <h4 className="text-xl font-bold text-white">
            {item.name}
          </h4>

          <p className="text-orange-400">
            {item.role}
          </p>
        </div>
      </div>
    </div>
  );
}