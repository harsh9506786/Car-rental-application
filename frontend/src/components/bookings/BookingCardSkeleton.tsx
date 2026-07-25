export default function BookingCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5 rounded-2xl border border-[#1f2937] bg-[#111827] p-5 sm:flex-row">
      {/* Image */}
      <div className="h-40 w-full shrink-0 rounded-xl bg-slate-800 sm:h-auto sm:w-48" />

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-slate-700" />
            <div className="h-4 w-32 rounded bg-slate-800" />
          </div>
          <div className="h-7 w-24 rounded-full bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="h-4 w-40 rounded bg-slate-800" />
          <div className="h-4 w-28 rounded bg-slate-800" />
          <div className="h-4 w-28 rounded bg-slate-800" />
        </div>

        <div className="flex items-center justify-between border-t border-[#1f2937] pt-4">
          <div className="h-4 w-12 rounded bg-slate-800" />
          <div className="h-6 w-20 rounded bg-slate-700" />
        </div>
      </div>
    </div>
  );
}