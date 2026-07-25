"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.dispatchEvent(new Event("authChanged"));

      if (response.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Email */}
        <div className="relative">
          <Mail
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
          h-16
          w-full
          rounded-2xl
          border
          border-gray-700
          bg-[#202A3B]
          pl-14
          pr-5
          text-lg
          text-white
          placeholder:text-gray-400
          outline-none
          transition
          focus:border-orange-500
          "
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
          />

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="
          h-16
          w-full
          rounded-2xl
          border
          border-gray-700
          bg-[#202A3B]
          pl-14
          pr-14
          text-lg
          text-white
          placeholder:text-gray-400
          outline-none
          transition
          focus:border-orange-500
          "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-orange-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="
  flex
  h-16
  w-full
  items-center
  justify-center
  cursor-pointer
  rounded-full
  bg-gradient-to-r
  from-orange-600
  to-orange-500
  text-lg
  font-bold
  text-white
  transition
  duration-300
  hover:scale-[1.02]
  hover:shadow-[0_10px_35px_rgba(249,115,22,0.35)]
  disabled:cursor-not-allowed
  disabled:opacity-70
"
        >
          {loading ? "Signing In..." : "ACCESS PREMIUM GARAGE"}
        </button>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-7 text-center">
          <p className="text-gray-400">Don't have an account?</p>

          <Link
            href="/signup"
            className="
          mt-5
          flex
          h-14
          w-full
          items-center
          justify-center
          rounded-2xl
          border
          border-orange-500
          text-lg
          font-semibold
          text-orange-400
          transition
          hover:bg-orange-500
          hover:text-white
          "
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </form>
    </>
  );
}
