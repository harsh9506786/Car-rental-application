import CarTable from "@/components/admin/CarTable";
import Link from "next/link";
export default function CarsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Cars</h1>

          <p className="mt-2 text-slate-400">Manage your fleet</p>
        </div>

        <Link
          href="/admin/cars/new"
          className="
    rounded-xl
    bg-orange-500
    px-5
    py-3
    font-semibold
    text-white
    transition
    hover:bg-orange-600
  "
        >
          + Add Car
        </Link>
      </div>
      <CarTable />
    </div>
  );
}
