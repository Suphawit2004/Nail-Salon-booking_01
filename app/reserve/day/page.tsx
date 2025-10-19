"use client";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { SERVICES } from "@/lib/catalog";
import { useState } from "react";

export default function DayPage(){
  const q = useSearchParams();
  const router = useRouter();
  const serviceId = q.get("serviceId") ?? "svc-01";
  const s = SERVICES[serviceId];
  const today = new Date().toISOString().slice(0,10);
  const [date,setDate] = useState(today);
  return (
    <LayoutWrapper>
      <section className="px-4 mt-4">
        <h2 className="text-sm font-semibold text-pink-600 mb-3">เลือกวัน</h2>
        <div className="rounded-2xl border border-pink-100 bg-pink-50/60 shadow p-4">
          <h3 className="font-semibold text-gray-800">{s.title}</h3>
          <div className="mt-4">
            <label className="text-xs text-gray-600">วันที่ต้องการ</label>
            <input type="date" value={date} min={today} onChange={e=>setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm"/>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={()=>router.push(`/reserve/time?serviceId=${serviceId}&date=${date}`)} className="px-4 py-2 rounded-xl bg-pink-400 text-white text-sm">ถัดไป</button>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
