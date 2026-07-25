import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SignupCard from "@/components/auth/SignupCard";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen items-start justify-center overflow-hidden bg-[#111827] px-6 pt-24 pb-10 sm:items-center sm:pt-10">

      {/* Background Glow */}
      <div className="absolute left-1/4 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-orange-400/10 blur-[120px]" />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-full bg-[#1F2937] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2A3445]"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      <SignupCard />
    </main>
  );
}