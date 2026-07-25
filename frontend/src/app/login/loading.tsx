export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div
        className="
          h-12
          w-12
          animate-spin
          rounded-full
          border-4
          border-orange-400/20
          border-t-orange-400
        "
      />
    </div>
  );
}