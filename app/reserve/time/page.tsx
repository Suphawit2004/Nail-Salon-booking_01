"use client";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { useMemo, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function gen(start="10:00", end="19:00", step=30){
  const [sh,sm]=start.split(":").map(Number), [eh,em]=end.split(":").map(Number);
  const s:string[]=[]; for(let m=sh*60+sm; m<=eh*60+em; m+=step){const hh=String(Math.floor(m/60)).padStart(2,"0");const mm=String(m%60).padStart(2,"0");s.push(`${hh}:${mm}`);} return s;
}

export default function TimePage(){
  const q = useSearchParams(); const router = useRouter();
  const serviceId = q.get("serviceId") ?? ""; const date = q.get("date") ?? "";
  const slots = useMemo(()=>gen(),[]);
  const [busy,setBusy]=useState<string[]>([]); const [sel,setSel]=useState("");

  useEffect(()=>{ if(!serviceId||!date) return;
    fetch(`/api/bookings?serviceId=${serviceId}&date=${date}`).then(r=>r.json()).then((list:any[])=>setBusy(list.map(x=>x.time))).catch(()=>setBusy([]));
  },[serviceId,date]);

  return (
    <LayoutWrapper>
      <section className="px-4 mt-4">
        <h2 className="text-sm font-semibold text-pink-600 mb-3">เลือกเวลา</h2>
        <div className="rounded-2xl border border-pink-100 bg-pink-50/60 shadow p-4">
          <p className="text-xs text-gray-600">วันที่ {date}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {slots.map(t=>{
              const disabled = busy.includes(t); const active = sel===t;
              return <button key={t} disabled={disabled} onClick={()=>setSel(t)} className={`px-3 py-1.5 rounded-lg text-xs border ${disabled?'bg-gray-100 border-gray-200 text-gray-400':active?'bg-pink-500 border-pink-500 text-white':'bg-white border-pink-200 text-pink-700'}`}>{t}</button>
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={()=>router.push(`/reserve/confirm?serviceId=${serviceId}&date=${date}&time=${sel}`)} disabled={!sel} className="px-4 py-2 rounded-xl bg-pink-400 text-white text-sm disabled:opacity-40">ถัดไป</button>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
