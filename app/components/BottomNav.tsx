
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, CalendarCheck, MessageSquareHeart, User2 } from "lucide-react";
const items = [
  { href: "/", label: "หน้าแรก", Icon: Home },
  { href: "/booking", label: "จองคิว", Icon: Calendar },
  { href: "/all-bookings", label: "จองทั้งหมด", Icon: CalendarCheck },
  { href: "/reviews", label: "รีวิว", Icon: MessageSquareHeart },
  { href: "/admin", label: "ผู้ดูแล", Icon: User2 },
];
export default function BottomNav(){
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-pink-100 bg-gradient-to-t from-pink-50/95 to-white/50 backdrop-blur-sm" style={{paddingBottom: "calc(env(safe-area-inset-bottom, 0px))"}}>
      <ul className="mx-auto grid max-w-sm grid-cols-5 py-2">
        {items.map(({href,label,Icon})=>{
          const active = pathname===href;
          return (
            <li key={href} className="text-center">
              <Link href={href} className={active ? "text-pink-600 flex flex-col items-center gap-1":"text-pink-800/70 flex flex-col items-center gap-1"}>
                <Icon className="h-4 w-4"/><span className="text-[10px]">{label}</span>{active ? <span className="mt-0.5 h-1 w-6 rounded-full bg-emerald-500"></span> : <span className="mt-0.5 h-1 w-6"></span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  );
}
