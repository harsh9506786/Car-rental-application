"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import api from "@/lib/axios";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { useToast } from "@/context/ToastContext";

export default function GoogleSignInButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await api.post("/api/auth/google-login", {
        idToken,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.dispatchEvent(new Event("authChanged"));

      if (response.data.user.role === "admin") {
    router.push("/admin");
      } else {
        router.push(redirectTo || "/");
      }
    } catch (error: any) {
      console.log(error);

      // User closing the popup shouldn't show a scary error toast
      if (error?.code === "auth/popup-closed-by-user") {
        setLoading(false);
        return;
      }

      showToast(
        "error",
        "Google Sign-In Failed",
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex h-16 w-full items-center justify-center gap-3 rounded-full border border-gray-700 bg-[#202A3B] text-base font-semibold text-white transition duration-300 hover:scale-[1.02] hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
      >
        <svg width="22" height="22" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
        Continue with Google
      </button>
    </>
  );
}
