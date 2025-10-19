"use client";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LayoutWrapper from "../components/LayoutWrapper";
import { CalendarDays } from "lucide-react";

const TZ = "+07:00";
function todayStr(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}` }
function genTimes(){ const arr:string[]=[]; for(let h=9; h<=20; h++){ for(const m of [0,30]) arr.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`) } return arr }

const SERVICES: Record<string,{title:string;detail:string}> = {
  "svc-01": { title:"ถอดPVC และต่อเล็บ", detail:"ถอด pvc ต่อเล็บ ทาสีเจล สีคุม แน่นสวย\nอัปเกรดลายได้" },
  "svc-02": { title:"ถอดpvc ทาสีเจล", detail:"ถอด pvc ทำความสะอาดโคนเล็บ\nทาสีเจล ครบทุกขั้นตอน" },
  "svc-03": { title:"ทาสีเจล", detail:"ตะไบ ตัดหนัง ทาสีเจล\nโทนสวย ติดทน เงา" },
};

export default function ReservePage(){
  const q = useSearchParams(); const router = useRouter();
  const serviceId = q.get("serviceId") ?? "svc-03"; const meta = SERVICES[serviceId] ?? SERVICES["svc-03"];
  const [date,setDate] = useState(todayStr()); const [time,setTime] = useState(""); const [taken,setTaken]=useState<Record<string,true>>({});
  useEffect(()=>{ (async()=>{ const r=await fetch("/api/bookings",{cache:"no-store"}); const list=await r.json(); const m:Record<string,true>={}; (list||[]).forEach((b:any)=>{ if(b.status!=="CANCELLED") m[`${b.date} ${b.time}`]=true; }); setTaken(m); })(); },[]);
  const times = useMemo(genTimes,[]);
  const isPast = (d:string,t:string)=> new Date(`${d}T${t}:00${TZ}`).getTime() < Date.now();
  const handleNext = async()=>{
    if(!time){ alert("โปรดเลือกเวลา"); return; }
    try{
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ serviceId, date, time })
      });
      if(!res.ok){
        const e = await res.json().catch(()=>({}));
        alert(e?.error || "สร้างการจองไม่สำเร็จ");
        return;
      }
      const bk = await res.json();
      router.push(`/pay/${bk.id}`);
    }catch(err){
      alert("เกิดข้อผิดพลาดในการจอง");
    }
  };
  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mt-4">เลือกวัน เวลา</h2>
      <div className="mt-2 rounded-[18px] bg-pink-50 ring-1 ring-pink-100 shadow-[0_10px_24px_rgba(255,182,193,.18)] p-4">
        <h3 className="font-semibold text-gray-800">{meta.title}</h3>
        <div className="mt-3">
          <label className="block text-xs text-gray-500 mb-1">รายละเอียด</label>
          <textarea readOnly value={meta.detail} className="w-full h-24 rounded-[14px] bg-white ring-1 ring-pink-100 p-3 text-[13px] leading-relaxed text-gray-700"/>
        </div>
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-1">วันที่จอง</label>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-pink-500"/>
            <input type="date" min={todayStr()} value={date} onChange={(e)=>{ setDate(e.target.value); setTime(""); }} className="flex-1 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-pink-400 text-sm pb-0.5"/>
          </div>
        </div>
        <div className="mt-4">
          <div className="block text-xs text-gray-600 mb-2">เวลาจอง</div>
          <div className="grid grid-cols-6 gap-2 max-[360px]:grid-cols-4">
            {times.map((t)=>{
              const disabled = taken[`${date} ${t}`] || isPast(date,t);
              const active = time===t;
              return <button key={t} disabled={disabled} onClick={()=>setTime(t)} className={["h-9 rounded-full border text-[12px] transition-colors", active? "bg-pink-500 text-white border-pink-500":"border-gray-300 text-gray-700 hover:bg-pink-50", disabled? "opacity-40 cursor-not-allowed hover:bg-transparent":""].join(" ")}>{t}</button>
            })}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleNext} className="px-5 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600">ถัดไป</button>
        </div>
      </div>
    </LayoutWrapper>
  );
}
