import Image from "next/image";
import LoginForm from "./LoginForm"

export default function LoginCard() {
  return (
    <div
      className="
      relative
      w-full
      max-w-md
      overflow-hidden
      rounded-[34px]
      border
      border-white/5
      bg-[#161F2E]/90
      p-10
      shadow-[0_20px_80px_rgba(0,0,0,0.55)]
      backdrop-blur-xl
    "
    >
      {/* Top Right Glow */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

      {/* Bottom Left Glow */}
      <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-orange-500/10 blur-3xl" />

      {/* Logo */}
      <div className="flex flex-col items-center">

        {/* Agar logo image hai to yaha use karo */}
        {/*
        <Image
          src="/logo.png"
          alt="KarZone"
          width={170}
          height={55}
        />
        */}

        {/* Temporary Logo */}
        <h1 className="text-5xl font-extrabold tracking-wider">
          <span className="text-white">DRIVE</span>
          <span className="text-orange-500">GO</span>
        </h1>

        <h2 className="mt-12 text-5xl font-bold text-[#FFD2A4]">
          PremiumDrive
        </h2>

        <p className="mt-3 text-center text-sm uppercase tracking-[4px] text-orange-400/70">
          Luxury Mobility Experience
        </p>
      </div>

      {/* Form */}
      <div className="mt-12">
        <LoginForm />
      </div>
    </div>
  );
}