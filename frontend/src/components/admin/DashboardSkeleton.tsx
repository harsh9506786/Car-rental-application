export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 rounded bg-slate-700" />
        <div className="mt-3 h-4 w-64 rounded bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-[#111827] p-6">
            <div className="h-5 w-24 rounded bg-slate-700" />
            <div className="mt-5 h-8 w-16 rounded bg-slate-600" />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-[#111827] p-6">
        <div className="mb-5 h-6 w-44 rounded bg-slate-700" />

        {[1,2,3,4,5].map((i)=>(
          <div
            key={i}
            className="mb-4 flex justify-between border-b border-slate-700 pb-4"
          >
            <div className="h-4 w-24 rounded bg-slate-700"/>
            <div className="h-4 w-20 rounded bg-slate-700"/>
            <div className="h-4 w-24 rounded bg-slate-700"/>
            <div className="h-4 w-24 rounded bg-slate-700"/>
            <div className="h-8 w-28 rounded bg-slate-700"/>
          </div>
        ))}
      </div>
    </div>
  );
}