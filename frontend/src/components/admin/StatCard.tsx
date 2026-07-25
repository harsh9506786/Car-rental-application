import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-700
        bg-[#101826]
        p-6
        transition
        hover:border-orange-500
        hover:-translate-y-1
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h2>
        </div>

        <div
          className="
            rounded-2xl
            bg-orange-500/20
            p-4
            text-orange-500
          "
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}