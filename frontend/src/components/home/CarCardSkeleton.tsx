export default function CarCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-800 bg-[#0B1120]">
      {/* Image */}
      <div className="h-64 w-full bg-slate-800" />

      <div className="space-y-4 p-6">
        {/* Title */}
        <div className="h-6 w-3/4 rounded bg-slate-700" />

        {/* Price */}
        <div className="h-5 w-1/3 rounded bg-slate-700" />

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="h-10 rounded bg-slate-800" />
          <div className="h-10 rounded bg-slate-800" />
          <div className="h-10 rounded bg-slate-800" />
        </div>

        {/* Button */}
        <div className="pt-4">
          <div className="h-12 w-full rounded-xl bg-slate-700" />
        </div>
      </div>
    </div>
  );
}