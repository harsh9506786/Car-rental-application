"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Topbar({ setSidebarOpen }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.notifications;
  };

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
  });

  const unreadCount = notifications.filter((item: any) => !item.isRead).length;

  // Outside click/touch se dropdown band karo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Bell click hote hi unread notifications ko read mark karo
  const handleBellClick = async () => {
    setOpen((prev) => !prev);

    if (!open && unreadCount > 0) {
      const token = localStorage.getItem("token");
      const unreadIds = notifications
        .filter((item: any) => !item.isRead)
        .map((item: any) => item._id);

      queryClient.setQueryData(["notifications"], (old: any) =>
        old?.map((item: any) => ({ ...item, isRead: true })),
      );

      try {
        await Promise.all(
          unreadIds.map((id: string) =>
            api.put(
              `/api/notifications/${id}/read`,
              {},
              { headers: { Authorization: `Bearer ${token}` } },
            ),
          ),
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Notification pe click hote hi related booking page pe le jao
  const handleNotificationClick = (item: any) => {
    setOpen(false);

    if (item.type === "booking" && item.bookingId) {
      router.push("/admin/bookings");
    }
  };

  return (
    <header
      className="
flex
items-center
justify-between
border-b
border-slate-700
bg-[#101826]
px-4
py-4

md:px-8
"
    >
      {/* Left */}

      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}

        <button
          onClick={() => setSidebarOpen(true)}
          className="
rounded-lg
bg-[#0B1120]
p-2
text-white
transition
hover:bg-slate-800

md:hidden
"
        >
          <Menu size={22} />
        </button>

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="
absolute
left-4
top-1/2
-translate-y-1/2
text-slate-400
"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
w-[170px]
rounded-xl
border
border-slate-700
bg-[#0B1120]
py-3
pl-11
pr-4
text-sm
text-white
outline-none
transition
focus:border-orange-500

sm:w-[260px]
lg:w-[420px]
xl:w-[520px]
"
          />
        </div>

        {/* Notification */}

        <div className="relative">
          <button
            onClick={handleBellClick}
            className="
      relative
      rounded-xl
      bg-[#0B1120]
      p-3
      cursor-pointer
      text-slate-300
      transition
      hover:bg-slate-800
      hover:text-white
    "
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span
                className="
        absolute
        -right-1
        -top-1
        flex
        h-5
        w-5
        items-center
        justify-center
        rounded-full
        bg-red-500
        text-xs
        font-bold
        text-white
      "
              >
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <>
              {/* Mobile Backdrop */}
              <div
                className="
          fixed
          inset-0
          z-40
          bg-black/50
          sm:hidden
        "
              />

              {/* Dropdown */}
              <div
                ref={dropdownRef}
                className="
          fixed
          left-1/2
          top-1/2
          z-50
          w-[90vw]
          max-w-sm
          py-4
          -translate-x-1/2
          -translate-y-1/2
          rounded-2xl
          border
          border-slate-700
          bg-[#111827]
          shadow-2xl

          sm:absolute
          sm:right-0
          sm:left-auto
          sm:top-full
          sm:w-[420px]
          sm:max-w-none
          sm:translate-x-0
          sm:translate-y-0
          sm:mt-3
        "
              >
                <div className="border-b border-slate-700 p-4">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>

                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-slate-400">
                      No Notifications
                    </p>
                  ) : (
                    notifications.map((item: any) => (
                      <div
                        key={item._id}
                        onClick={() => handleNotificationClick(item)}
                        className={`
              border-b
              border-slate-700
              px-4
              py-4
              overflow-hidden
              hover:bg-slate-800
              ${item.type === "booking" && item.bookingId ? "cursor-pointer" : ""}
            `}
                      >
                        <h4 className="font-semibold text-white">
                          {item.title}
                        </h4>

                        <p
                          className="
    mt-1
    text-sm
    leading-6
    text-slate-300
    break-words
    whitespace-normal
  "
                        >
                          {item.message}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right */}

      <div
        className="
flex
items-center
gap-3
rounded-xl
bg-[#0B1120]
px-3
py-2
"
      >
        <div
          className="
flex
h-10
w-10
items-center
justify-center
rounded-full
bg-orange-500
font-bold
text-white
"
        >
          A
        </div>

        {/* Hide on very small screens */}

        <div className="hidden sm:block">
          <h3 className="font-semibold text-white">Admin</h3>

          <p className="text-xs text-slate-400">Super Admin</p>
        </div>
      </div>
    </header>
  );
}
