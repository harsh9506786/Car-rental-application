"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Cars",
    href: "/cars",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("authChanged", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    setUser(null);
    setIsOpen(false);

    router.push("/");
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="
    flex
    h-[80px]
    w-full
    items-center
    justify-between
    px-8
    lg:px-16
    bg-black/20
    backdrop-blur-2xl
  "
      >
        <div className="flex items-center">
          {/* Logo */}
          <Link
            href="/"
            className="
   text-[40px]
font-extrabold
tracking-tight
    text-white
  "
          >
            DRIVE
            <span className="text-orange-400">GO</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex items-center gap-10">
            {navLinks.map((item, index) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    className={`group relative px-5 py-2 text-md font-medium transition-all duration-300 hover:text-orange-400 ${
                      isActive ? "text-orange-400" : "text-white"
                    }`}
                  >
                    {item.label}

                    {/* Animated Underline */}
                    <span
                      className={`
    absolute
    left-1/2
    -translate-x-1/2
    bottom-0
    h-[2px]
    rounded-full
    bg-gradient-to-r
    from-orange-400
    to-orange-500
    transition-all
    duration-300
    group-hover:w-8
    ${isActive ? "w-8" : "w-0"}
  `}
                    />
                  </Link>
                </li>
              );
            })}
            {user && (
              <li>
                <Link
                  href="/my-bookings"
                  className={`group relative px-5 py-2 text-md font-medium transition-all duration-300 hover:text-orange-400 ${
                    pathname === "/my-bookings"
                      ? "text-orange-400"
                      : "text-white"
                  }`}
                >
                  My Bookings
                  <span
                    className={`
    absolute
    left-1/2
    -translate-x-1/2
    bottom-0
    h-[2px]
    rounded-full
    bg-gradient-to-r
    from-orange-400
    to-orange-500
    transition-all
    duration-300
    group-hover:w-8
    ${pathname === "/my-bookings" ? "w-8" : "w-0"}
  `}
                  />
                </Link>
              </li>
            )}
            {user?.role === "admin" && (
              <>
                <li>
                  <Link
                    href="/admin"
                    className="
group
relative
px-5
py-2
text-md
font-medium
text-white
whitespace-nowrap
transition-all
duration-300
hover:text-orange-400
"
                  >
                    Admin Panel
                    <span
                      className="
    absolute
    left-1/2
    -translate-x-1/2
    bottom-0
    h-[2px]
    w-0
    rounded-full
    bg-gradient-to-r
    from-orange-400
    to-orange-500
    transition-all
    duration-300
    group-hover:w-8
  "
                    />
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="hidden md:flex justify-end items-center gap-4">
          {user ? (
            <>
              <div
                className="
    flex
    items-center
    gap-3
    rounded-full
    border
    border-white/10
   bg-[#0B1120]/90
backdrop-blur-2xl

    px-5
    py-2.5
    backdrop-blur-xl
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
      bg-gradient-to-r
      from-orange-400
      to-orange-500
      text-white
    "
                >
                  <FaUser />
                </div>

                <span className="font-medium text-white">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="
 
rounded-full
border
border-white/10
bg-white/5
px-12
py-3
cursor-pointer
font-medium
text-white
transition
hover:border-orange-400
hover:bg-orange-500
hover:text-white
  "
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              prefetch
              className="
rounded-full
border
border-white/10
bg-white/5
px-12
py-3
font-medium
text-white
transition
hover:border-orange-400
hover:bg-orange-500
hover:text-white
"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl text-white md:hidden"
        >
          {isOpen ? <HiXMark /> : <HiBars3 />}
        </button>
      </nav>
      {isOpen && (
        <div
          className="
  md:hidden
  mt-2
  rounded-3xl
  bg-white
  shadow-xl
  overflow-hidden
  mx-auto
 max-w-[1550px]
  "
        >
          <div className="flex flex-col p-6">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="
          group
  relative
  py-4
  text-base
  font-medium
  text-gray-500
  transition-all
  duration-300
  hover:text-orange-400

        "
            >
              Home
            </Link>

            <Link
              href="/cars"
              onClick={() => setIsOpen(false)}
              className="
  group
  relative
  py-4
  text-base
  font-medium
  text-gray-500
  transition-all
  duration-300
  hover:text-orange-400"
            >
              Cars
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="
  group
  relative
  py-4
  text-base
  font-medium
  text-gray-500
  transition-all
  duration-300
  hover:text-orange-400
  "
            >
              Contact
            </Link>

            {user && (
              <Link
                href="/my-bookings"
                onClick={() => setIsOpen(false)}
                className="
  group
  relative
  py-4
  text-base
  font-medium
  text-gray-500
  transition-all
  duration-300
  hover:text-orange-400
  "
              >
                My Bookings
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="group
relative
py-4
text-md
font-medium
text-gray-500
whitespace-nowrap
transition-all
duration-300
hover:text-orange-400"
              >
                Admin Panel
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-orange-500 font-medium">
                  <FaUser />
                  {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="
group flex items-center gap-2 rounded-xl py-4 text-lg font-medium text-gray-500 transition-all duration-300 hover:text-orange-400
  "
                >
                  <FaUser />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                prefetch
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-2 rounded-xl py-4 text-lg font-medium text-gray-500 transition-all duration-300 hover:text-orange-400"
              >
                <FaUser />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
