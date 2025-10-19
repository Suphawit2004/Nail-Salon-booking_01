
"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function LayoutWrapper({ children }:{ children: React.ReactNode }){
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <header className="app-banner">
        <div className="mx-auto max-w-screen-md px-4 py-6 flex items-center justify-center">
          <Image src={logo} alt="Min Nail Studio" className="h-16 w-auto object-contain" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-screen-md page-pad-bottom">
        {children}
      </main>
      <nav className="tabbar">
        <div className="tabbar-inner">
          <Link href="/" className="text-center text-xs">หน้าแรก</Link>
          <Link href="/booking" className="text-center text-xs">จองคิว</Link>
          <Link href="/all-bookings" className="text-center text-xs">จองทั้งหมด</Link>
          <Link href="/reviews" className="text-center text-xs">รีวิว</Link>
          <Link href="/profile" className="text-center text-xs">ผู้ดูแล</Link>
        </div>
      </nav>
    </div>
  );
}
