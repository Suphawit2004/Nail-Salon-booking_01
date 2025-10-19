"use client";
import Link from "next/link";
import { SERVICES } from "@/lib/catalog";

export default function BookingPage(){
  const items = Object.values(SERVICES);
  return (
    <section className="px-4 mt-6 pb-24">
      <h2 className="text-pink-600 font-semibold mb-3">เลือกบริการ</h2>
      <div className="space-y-4">
        {items.map((s)=> (
          <article key={s.id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-soft flex items-center gap-4">
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-pink-50 border border-pink-100 shrink-0">
              <img src={s.img || "/work1.jpg"} alt={s.title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{s.title}</p>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{s.desc}</p>
              <p className="text-sm text-pink-600 font-semibold mt-1">฿{(s.price as number).toLocaleString()}</p>
            </div>
            <Link href={`/reserve/select?serviceId=${s.id}`} className="px-4 py-2 rounded-xl bg-pink-500 text-white text-sm">จอง</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
