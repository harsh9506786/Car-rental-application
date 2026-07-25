type Props = {
  rows?: number;
  columns?: number;
};

export default function TableSkeleton({
  rows = 6,
  columns = 5,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-[#111827] p-6 animate-pulse">
      <table className="w-full">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="pb-4">
                <div className="h-5 w-24 rounded bg-slate-700" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: columns }).map((_, j) => (
                <td key={j} className="py-5">
                  <div className="h-4 w-20 rounded bg-slate-700" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}