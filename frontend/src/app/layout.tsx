import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { ToastProvider } from "@/context/ToastContext";
import Providers from "@/providers/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "DriveGo",
  description: "Premium Car Rental Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-black text-white antialiased overflow-x-hidden">
        <Providers>
          <AuthProvider>
            <ToastProvider>
              <LayoutWrapper>
                {children}
                
              </LayoutWrapper>
            </ToastProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
