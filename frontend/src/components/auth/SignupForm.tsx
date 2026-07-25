"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/auth/signup", {
        name,
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
      setLoading(false);

      alert(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="relative">
          <User
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter your full name"
            className="h-16 w-full rounded-2xl border border-gray-700 bg-[#202A3B] pl-14 pr-5 text-lg text-white placeholder:text-gray-400 outline-none transition focus:border-orange-500"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-16 w-full rounded-2xl border border-gray-700 bg-[#202A3B] pl-14 pr-5 text-lg text-white placeholder:text-gray-400 outline-none transition focus:border-orange-500"
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
            placeholder="Create password"
            className="h-16 w-full rounded-2xl border border-gray-700 bg-[#202A3B] pl-14 pr-14 text-lg text-white placeholder:text-gray-400 outline-none transition focus:border-orange-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
          />

          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="h-16 w-full rounded-2xl border border-gray-700 bg-[#202A3B] pl-14 pr-14 text-lg text-white placeholder:text-gray-400 outline-none transition focus:border-orange-500"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-400"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Create Account Button */}
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
          {loading ? "Creating Account..." : "CREATE ACCOUNT"}
        </button>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">Already have an account?</p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              router.push("/login");
            }}
            className="mt-5 flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl border border-orange-500 text-lg font-semibold text-orange-400 transition hover:bg-orange-500 hover:text-white"
          >
            SIGN IN
          </button>
        </div>
      </form>
    </>
  );
}
