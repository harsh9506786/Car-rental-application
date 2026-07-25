export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
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