"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!token) {
        router.replace("/login");
        return;
      }

      if (user?.role !== "admin") {
        router.replace("/");
        return;
      }

      setChecking(false);
    };

    checkAdmin();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1120] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1120]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col md:ml-72">
        <Topbar setSidebarOpen={setSidebarOpen} />

        <main
          className="
            flex-1
            overflow-y-auto
            p-4
            md:p-6
            xl:p-8
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
