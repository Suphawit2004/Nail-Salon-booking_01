"use client";
import Image from "next/image";
import Link from "next/link";
import { Home, Calendar, CalendarCheck, User2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({children}:{children:React.ReactNode}){
  const pathname = usePathname();
  const menus = [
    { icon: Home, label: "หน้าแรก", href: "/" },
    { icon: Calendar, label: "จองคิว", href: "/booking" },
    { icon: CalendarCheck, label: "จองทั้งหมด", href: "/all-bookings" },
    { icon: User2, label: "ผู้ดูแล", href: "/account" },
  ];
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-800">
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-screen-sm">
          <div className="h-[120px] sm:h-[150px] w-full bg-gradient-to-b from-[#ffd1e1] via-[#ffcfe0] to-[#ffe9f1] border-b border-pink-100 flex items-center justify-center shadow-[0_10px_24px_rgba(255,182,193,.35)]">
            <Image src="/logo.png" alt="Min Nail Studio" width={220} height={110} className="h-[64px] sm:h-[84px] w-auto" priority />
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-screen-sm mx-auto px-4 pb-32">{children}</main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-40">
        <div className="relative mx-auto max-w-screen-sm bg-gradient-to-t from-pink-200 to-pink-50 border-t border-pink-100">
          <ul className="flex items-center justify-around py-2">
            {menus.map(({icon:Icon,label,href})=>{
              const active = pathname===href;
              return <li key={href}><Link href={href} className={active? "text-pink-700":"text-gray-700"}><div className="flex flex-col items-center gap-1"><Icon className="h-5 w-5 text-pink-600"/><span className="text-[11px]">{label}</span></div></Link></li>
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
