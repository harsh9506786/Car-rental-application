"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone, ShieldCheck, User } from "lucide-react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/lib/axios";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { useToast } from "@/context/ToastContext";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function PhoneLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { showToast } = useToast();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Invisible reCAPTCHA - required by Firebase to prevent OTP abuse.
    // It renders into the div below but stays invisible to the user.
    //
    // Important: we create a fresh verifier on every mount and clear it
    // on unmount. Next.js dev mode runs effects twice (React Strict Mode),
    // which previously left a stale verifier pointing at a removed DOM
    // node - causing "reCAPTCHA client element has been removed".
    if (!recaptchaContainerRef.current) return;

    const verifier = new RecaptchaVerifier(
      auth,
      recaptchaContainerRef.current,
      { size: "invisible" },
    );

    window.recaptchaVerifier = verifier;

    return () => {
      verifier.clear();
      window.recaptchaVerifier = undefined;
    };
  }, []);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      showToast("warning", "Invalid Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      const fullNumber = phone.startsWith("+") ? phone : `+91${phone}`;

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullNumber,
        window.recaptchaVerifier!,
      );

      confirmationRef.current = confirmation;
      setStep("otp");
      showToast("success", "OTP Sent", `A code was sent to ${fullNumber}.`);
    } catch (error: any) {
      console.log(error);
      showToast(
        "error",
        "Could Not Send OTP",
        error?.message || "Please check the number and try again.",
      );

      // Invisible reCAPTCHA gets "used up" after a failed attempt - reset
      // it so the next click doesn't silently fail again
      try {
        const widgetId = await window.recaptchaVerifier?.render();
        // @ts-ignore - grecaptcha is injected globally by Firebase's script
        if (widgetId !== undefined && window.grecaptcha) {
          // @ts-ignore
          window.grecaptcha.reset(widgetId);
        }
      } catch (resetError) {
        console.log("Could not reset recaptcha:", resetError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      showToast("warning", "Invalid OTP", "Please enter the 6-digit code.");
      return;
    }

    if (!confirmationRef.current) {
      showToast("error", "Session Expired", "Please request a new OTP.");
      setStep("phone");
      return;
    }

    setLoading(true);

    try {
      const result = await confirmationRef.current.confirm(otp);
      const idToken = await result.user.getIdToken();

      const response = await api.post("/api/auth/phone-login", {
        idToken,
        name,
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
      showToast(
        "error",
        "Verification Failed",
        error?.response?.data?.message || "Incorrect OTP. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}

      <div className="space-y-6">
        {step === "phone" && (
          <>
            <div className="relative">
              <User
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
              />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="h-16 w-full rounded-2xl border border-gray-700 bg-[#202A3B] pl-14 pr-5 text-lg text-white placeholder:text-gray-400 outline-none transition focus:border-orange-500"
              />
            </div>

            <div className="relative">
              <Phone
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
              />

              <span className="absolute left-14 top-1/2 -translate-y-1/2 text-lg text-gray-400">
                +91
              </span>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit mobile number"
                className="h-16 w-full rounded-2xl border border-gray-700 bg-[#202A3B] pl-24 pr-5 text-lg text-white placeholder:text-gray-400 outline-none transition focus:border-orange-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="flex h-16 w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-lg font-bold text-white transition duration-300 hover:scale-[1.02] hover:shadow-[0_10px_35px_rgba(249,115,22,0.35)] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              SEND OTP
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="relative">
              <ShieldCheck
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
              />

              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit OTP"
                className="h-16 w-full rounded-2xl border border-gray-700 bg-[#202A3B] pl-14 pr-5 text-lg tracking-[6px] text-white placeholder:tracking-normal placeholder:text-gray-400 outline-none transition focus:border-orange-500"
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="flex h-16 w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-lg font-bold text-white transition duration-300 hover:scale-[1.02] hover:shadow-[0_10px_35px_rgba(249,115,22,0.35)] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              VERIFY & CONTINUE
            </button>

            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-center text-sm text-gray-400 transition hover:text-orange-400"
            >
              Change phone number
            </button>
          </>
        )}
      </div>

      {/* Invisible reCAPTCHA anchor - required by Firebase, stays hidden */}
      <div ref={recaptchaContainerRef} />
    </>
  );
}