"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import { ArrowLeft } from "lucide-react";

function titleFor(path: string){
  if (path.startsWith("/booking")) return "เลือกบริการ";
  if (path.startsWith("/reserve")) return "เลือกวัน-เวลา";
  if (path.startsWith("/all-bookings")) return "จองทั้งหมด";
  if (path.startsWith("/admin")) return "ผู้ดูแล";
  if (path.startsWith("/pay") && path.includes("/checkout")) return "ยืนยันการชำระเงิน";
  if (path.startsWith("/pay")) return "ข้อมูลการชำระเงิน";
  return "Min Nail Studio";
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-pink-50 to-white border-b border-pink-100 shadow-sm">
        <div className={isHome ? "mx-auto max-w-sm px-3 py-2" : "mx-auto max-w-sm px-4 py-4"}>
          {isHome ? (
            <div className="text-center py-2">
              <Image
                src="/logo.png"
                alt="Min Nail Studio"
                width={150}
                height={90}
                className="mx-auto"
                priority
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="rounded-full border border-pink-200 p-1.5 hover:bg-pink-50"
                aria-label="ย้อนกลับ"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h1 className="text-base font-semibold text-pink-700">
                {titleFor(pathname)}
              </h1>
            </div>
          )}
        </div>
      </header>

      {/* Page body */}
      <div className="px-3">
        <div className="mx-auto min-h-[100dvh] max-w-sm bg-white rounded-3xl shadow-soft ring-1 ring-pink-100 overflow-hidden">
        <main className="page-pad-bottom">{children}</main>
        <BottomNav />
              </div>
      </div>
    </>
  );
}
