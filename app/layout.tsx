
import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import logo from "@/public/logo.png";
import BottomNav from "@/app/components/BottomNav";

export const metadata: Metadata = {
  title: "Min Nail Studio",
  description: "จองคิวทำเล็บ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-[var(--bg)]">
        {/* Banner Header (not fixed -> ไม่ซ้อน) */}
        <header className="banner relative z-10">
          <div className="mx-auto max-w-screen-md px-4 py-6 flex items-center justify-center">
            <Image src={logo} alt="Min Nail Studio" className="h-16 w-auto object-contain" />
          </div>
        </header>

        {/* Content */}
        <main className="section page-pad-bottom relative z-0">
          {children}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  );
}
