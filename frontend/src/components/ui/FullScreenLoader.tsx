"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function FullScreenLoader() {
  // Rendering via a portal into document.body escapes any ancestor with
  // backdrop-filter/filter/transform - those CSS properties create a new
  // "containing block" for position:fixed children, which traps the
  // overlay inside that ancestor instead of covering the full viewport.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
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
    </div>,
    document.body,
  );
}
