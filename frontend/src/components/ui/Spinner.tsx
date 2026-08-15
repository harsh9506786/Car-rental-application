export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-orange-500" />
    </div>
  );
}