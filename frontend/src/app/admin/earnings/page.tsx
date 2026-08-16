"use client";

import api from "@/lib/axios";
import Spinner from "@/components/ui/Spinner";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Smartphone, Building2, Wallet } from "lucide-react";

const methodIcons: Record<string, any> = {
  card: CreditCard,
  upi: Smartphone,
  netbanking: Building2,
  wallet: Wallet,
};

const methodLabels: Record<string, string> = {
  card: "Card",
  upi: "UPI",
  netbanking: "Netbanking",
  wallet: "Wallet",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EarningsPage() {
  const fetchEarnings = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/admin/earnings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-earnings"],
    queryFn: fetchEarnings,
    staleTime: 1000 * 60 * 2,
  });

  if (isLoading) {
    return <Spinner />;
  }

  const payments = data?.payments ?? [];
  const totalEarnings = data?.totalEarnings ?? 0;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-white">Earnings</h1>
      <p className="mb-6 text-slate-400">
        Total collected:{" "}
        <span className="font-bold text-orange-400">
          ₹{totalEarnings.toLocaleString("en-IN")}
        </span>
      </p>

      {payments.length === 0 ? (
        <div className="rounded-2xl bg-[#111827] py-16 text-center text-gray-500">
          No payments received yet.
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {payments.map((p: any) => {
              const Icon = methodIcons[p.paymentMethod] || CreditCard;
              return (
                <div
                  key={p._id}
                  className="rounded-2xl border border-gray-800 bg-[#111827] p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">
                        {p.user?.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {p.car?.brand} {p.car?.name}
                      </p>
                    </div>
                    <span className="shrink-0 text-lg font-bold text-green-400">
                      ₹{p.paidAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-800 pt-3 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Icon size={14} className="text-orange-400" />
                      {methodLabels[p.paymentMethod] || "Unknown"}
                    </div>
                    <span className="text-gray-500">
                      {formatDateTime(p.updatedAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-x-auto rounded-2xl bg-[#111827] p-6 sm:block">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Car</th>
                  <th className="pb-4">Method</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => {
                  const Icon = methodIcons[p.paymentMethod] || CreditCard;
                  return (
                    <tr key={p._id} className="border-b border-gray-800">
                      <td className="py-4">
                        <p className="text-white">{p.user?.name}</p>
                        <p className="text-xs text-gray-500">
                          {p.user?.email}
                        </p>
                      </td>
                      <td className="py-4 text-gray-300">
                        {p.car?.brand} {p.car?.name}
                      </td>
                      <td className="py-4">
                        <span className="flex items-center gap-1.5 text-gray-300">
                          <Icon size={14} className="text-orange-400" />
                          {methodLabels[p.paymentMethod] || "Unknown"}
                        </span>
                      </td>
                      <td className="py-4 text-gray-300">
                        {formatDateTime(p.updatedAt)}
                      </td>
                      <td className="py-4 font-bold text-green-400">
                        ₹{p.paidAmount?.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}