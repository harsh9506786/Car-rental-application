"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Car,
  CalendarDays,
  Users,
  LogOut,
  ArrowLeft,
  X,
} from "lucide-react";

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Cars",
    href: "/admin/cars",
    icon: Car,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setSidebarOpen(false);

    router.push("/");
  };

  return (
    <>
      {/* Mobile Overlay */}

      <div
        onClick={() => setSidebarOpen(false)}
        className={`
fixed
inset-0
z-40
bg-black/60
backdrop-blur-sm
transition-all
duration-300
md:hidden

${
  sidebarOpen
    ? "opacity-100 visible"
    : "opacity-0 invisible"
}
`}
      />

      <aside
        className={`
fixed
left-0
top-0
z-50
flex
h-screen
w-72
flex-col
border-r
border-slate-700
bg-[#101826]
transition-transform
duration-300

md:fixed
md:translate-x-0

${
  sidebarOpen
    ? "translate-x-0"
    : "-translate-x-full"
}
`}
      >
        {/* Header */}

        <div className="border-b border-slate-700 p-4.5 ">

          {/* Mobile Close */}

          <div className="mb-5 flex items-center justify-end md:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg bg-slate-800 p-2 text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="
hidden
md:flex
h-10
w-10
items-center
justify-center
rounded-full
bg-orange-500/10
text-orange-400
transition
hover:bg-orange-500
hover:text-white
"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="ml-3">
              <h1 className="text-2xl font-bold text-white">
                DriveGo
              </h1>

              <p className="text-sm text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={`
flex
items-center
gap-3
rounded-xl
px-4
py-3
transition-all

${
  active
    ? "bg-orange-500 text-white"
    : "text-slate-300 hover:bg-slate-800 hover:text-white"
}
`}
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}

        <div className="border-t border-slate-700 p-4">
          <button
            onClick={handleLogout}
            className="
flex
w-full
cursor-pointer
items-center
gap-3
rounded-xl
px-4
py-3
text-red-400
transition
hover:bg-red-500
hover:text-white
"
          >
            <LogOut size={20} />

            Logout
          </button>
        </div>
      </aside>
    </>
  );
}