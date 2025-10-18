"use client";
import Image from "next/image";
import Link from "next/link";
import { Home, Calendar, CalendarCheck, User2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const menus = [
    { icon: Home, label: "หน้าแรก", href: "/" },
    { icon: Calendar, label: "จองคิว", href: "/booking" },
    { icon: CalendarCheck, label: "จองทั้งหมด", href: "/all-bookings" },
    { icon: User2, label: "บัญชีฉัน", href: "/account" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-800">
      <header className="w-full bg-gradient-to-b from-pink-200 to-pink-50 shadow-md">
        <div className="flex items-center justify-center py-4">
          <Image src="/logo.png" alt="logo" width={160} height={120} className="object-contain w-[32vw] max-w-[160px] min-w-[100px] h-auto"/>
        </div>
      </header>

      <main className="flex-1 w-full max-w-screen-sm mx-auto px-4 pb-32">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-50">
        <div className="relative mx-auto max-w-screen-sm bg-gradient-to-t from-pink-200 to-pink-50 shadow-[0_-4px_10px_rgba(255,182,193,0.25)] border-t border-pink-100 backdrop-blur-md rounded-t-2xl">
          <ul className="flex items-center justify-around py-2">
            {menus.map(({ icon: Icon, label, href }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link href={href} className={["flex flex-col items-center transition", active ? "text-pink-700 scale-105" : "text-gray-600 hover:text-pink-600"].join(" ")}>
                    <Icon className={`h-5 w-5 ${active ? "text-pink-700" : "text-pink-500"}`} />
                    <span className={`text-[11px] mt-0.5 ${active ? "font-semibold text-pink-700" : ""}`}>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
