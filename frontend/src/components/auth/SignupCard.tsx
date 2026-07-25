import SignupForm from "./SignupForm";

export default function SignupCard() {
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
      {/* Glow */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-extrabold tracking-wider">
          <span className="text-white">DRIVE</span>
          <span className="text-orange-500">GO</span>
        </h1>

        <h2 className="mt-12 text-5xl font-bold text-[#FFD2A4]">
          Create Account
        </h2>

        <p className="mt-3 text-center text-sm uppercase tracking-[4px] text-orange-400/70">
          Join Premium Mobility
        </p>
      </div>

      <div className="mt-12">
        <SignupForm />
      </div>
    </div>
  );
}
