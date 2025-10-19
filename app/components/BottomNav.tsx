
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function IconHome(active:boolean){ return (
  <svg viewBox="0 0 24 24" className={(active?"text-pink-600":"text-gray-800")+" w-6 h-6"} fill="currentColor">
    <path d="M12 3 2 12h3v9h6v-6h2v6h6v-9h3z"/>
  </svg>
);}
function IconCal(active:boolean){ return (
  <svg viewBox="0 0 24 24" className={(active?"text-pink-600":"text-gray-800")+" w-6 h-6"} fill="currentColor">
    <path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 7H5v10h14V9Z"/>
  </svg>
);}
function IconClock(active:boolean){ return (
  <svg viewBox="0 0 24 24" className={(active?"text-pink-600":"text-gray-800")+" w-6 h-6"} fill="currentColor">
    <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 10.414V7h-2v6a1 1 0 0 0 .293.707l4 4 1.414-1.414L13 12.414Z"/>
  </svg>
);}
function IconUser(active:boolean){ return (
  <svg viewBox="0 0 24 24" className={(active?"text-pink-600":"text-gray-800")+" w-6 h-6"} fill="currentColor">
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5.33 0-8 2.667-8 6v2h16v-2c0-3.333-2.67-6-8-6Z"/>
  </svg>
);}

export default function BottomNav(){
  const pathname = usePathname() || "/";
  const items = [
    { href: "/", label: "หน้าหลัก", icon: IconHome },
    { href: "/booking", label: "นัดหมาย", icon: IconCal },
    { href: "/all-bookings", label: "จองทั้งหมด", icon: IconClock },
    { href: "/admin", label: "ผู้ดูแล", icon: IconUser },
  ];

  const isActive = (href:string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="tabbar z-20">
      <div className="mx-auto max-w-screen-md grid grid-cols-4 gap-2 px-8 py-2">
        {items.map((it)=>(
          <Link key={it.href} href={it.href} className="flex flex-col items-center justify-center text-xs select-none">
            <span className={(isActive(it.href)?"bg-pink-50":"")+" grid place-items-center h-10 w-10 rounded-full"}>
              {it.icon(isActive(it.href))}
            </span>
            <span className={(isActive(it.href)?"text-pink-600":"text-gray-800")+" mt-1"}>{it.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
