"use client";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { useMemo, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SERVICES } from "@/lib/catalog";

function gen(start="10:00", end="19:00", step=30){
  const [sh,sm]=start.split(":").map(Number), [eh,em]=end.split(":").map(Number);
  const res:string[]=[];
  for(let m=sh*60+sm; m<=eh*60+em; m+=step){
    const hh=String(Math.floor(m/60)).padStart(2,"0");
    const mm=String(m%60).padStart(2,"0");
    res.push(`${hh}:${mm}`);
  }
  return res;
}

function nextSlotMinutes(step=30){
  const now = new Date();
  const m = now.getHours()*60 + now.getMinutes();
  return Math.ceil(m/step)*step;
}

function isToday(isoDate:string){
  const t = new Date();
  const d = t.toISOString().slice(0,10);
  return d===isoDate;
}

export default function SelectPage(){
  const q = useSearchParams(); const router = useRouter();
  const serviceId = q.get("serviceId") ?? "svc-01";
  const s = SERVICES[serviceId];
  const today = new Date().toISOString().slice(0,10);
  const [date,setDate] = useState(today);
  const [busy,setBusy]=useState<string[]>([]);
  const [sel,setSel] = useState("");
  const slots = useMemo(()=>gen(),[]);

  useEffect(()=>{ // load taken slots for selected date
    setSel(""); // reset selection when date changes
    fetch(`/api/slots?date=${date}`).then(r=>r.json()).then(d=>setBusy(d.taken||[])).catch(()=>setBusy([]));
  },[date]);

  const minForToday = useMemo(()=> nextSlotMinutes(30),[]);

  const disabledReason = (t:string)=>{
    // 1) Past date not possible due to input min, but keep guard
    // 2) If today, disable past times < next slot
    if(isToday(date)){
      const [hh,mm] = t.split(":").map(Number);
      const mins = hh*60+mm;
      if(mins < minForToday) return "past";
    }
    // 3) taken by other bookings
    if(busy.includes(t)) return "taken";
    return null;
  };

  const canNext = !!date && !!sel && !disabledReason(sel);

  return (
    <LayoutWrapper>
      <section className="px-4 mt-4">
        <h2 className="text-sm font-semibold text-pink-600 mb-3">เลือกวัน &amp; เวลา</h2>

        <div className="rounded-2xl border border-pink-100 bg-pink-50/60 shadow p-4">
          <h3 className="font-semibold text-gray-800">{s.title}</h3>

          <div className="mt-4">
            <label className="text-xs text-gray-600">วันที่ต้องการ</label>
            <input type="date" value={date} min={today} onChange={e=>setDate(e.target.value)} className="block mt-1 rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm"/>
          </div>

          <div className="mt-4">
            <label className="text-xs text-gray-600">ช่วงเวลา</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map(t=>{
                const reason = disabledReason(t);
                const active = sel===t;
                return (
                  <button key={t} disabled={!!reason}
                    onClick={()=>setSel(t)}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${active?'bg-pink-500 border-pink-500 text-white':'bg-white border-pink-200 text-pink-700'} disabled:opacity-40`}>
                    {t}
                  </button>
                );
              })}
            </div>
            {isToday(date) && <p className="text-xs text-gray-500 mt-2">* เวลาที่ผ่านมาแล้วของวันนี้ถูกปิดเลือกอัตโนมัติ</p>}
          </div>

          <div className="mt-5 flex justify-end">
            <button disabled={!canNext}
              onClick={()=>router.push(`/reserve/confirm?serviceId=${serviceId}&date=${date}&time=${sel}`)}
              className="px-4 py-2 rounded-xl bg-pink-400 text-white text-sm disabled:opacity-40">
              ถัดไป
            </button>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
