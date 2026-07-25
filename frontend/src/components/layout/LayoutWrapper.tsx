"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Footer from "./Footer";

import AIAssistant from "@/components/ai/AIAssistant";
import ScrollToTop from "./Scrolltotop";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [aiOpen, setAiOpen] = useState(false);

  const hideLayout =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/cars/") ||
    pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Navbar />}

      <main>{children}</main>

      {!hideLayout && !aiOpen && <ScrollToTop />}

      {!hideLayout && (
        <AIAssistant
          open={aiOpen}
          setOpen={setAiOpen}
        />
      )}

      {!hideLayout && <Footer />}
    </>
  );
}