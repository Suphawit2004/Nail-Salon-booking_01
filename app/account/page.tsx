"use client";
import { useEffect, useMemo, useState } from "react";
import LayoutWrapper from "../components/LayoutWrapper";
type Status="PENDING"|"CONFIRMED"|"CANCELLED";
type Booking={id:string;serviceId:string;serviceTitle:string;date:string;time:string;createdAt:string;status:Status;customerName?:string;phone?:string;paymentMethod?:string;paidAt?:string;completedAt?:string;};
function startAt(b:Booking){ return new Date(`${b.date}T${b.time}:00+07:00`); }
const FILTERS=[{key:"ALL",label:"ทั้งหมด"},{key:"UPCOMING",label:"รอเข้ารับบริการ"},{key:"DONE",label:"เข้ารับบริการแล้ว"},{key:"CANCELLED",label:"ยกเลิก"}] as const;
type FilterKey=typeof FILTERS[number]["key"];
export default function AdminHistoryPage(){
  const [list,setList]=useState<Booking[]>([]);
  const [filter,setFilter]=useState<FilterKey>("ALL");
  const [q,setQ]=useState("");
  useEffect(()=>{
    (async()=>{ const r=await fetch("/api/bookings",{cache:"no-store"}); if(r.ok) setList(await r.json()); })();
    const es=new EventSource("/api/bookings/stream");
    es.onmessage=(ev)=>{ try{ const data=JSON.parse(ev.data); if(Array.isArray(data)) setList(data);}catch{} };
    return ()=> es.close();
  },[]);
  const counts = useMemo(()=>{
    const now=new Date(); let pending=0, done=0, cancelled=0;
    list.forEach(b=>{ if(b.status==="CANCELLED") cancelled++; else if(b.completedAt || startAt(b)<=now) done++; else pending++; });
    return { all:list.length, pending, done, cancelled };
  },[list]);
  const filtered = useMemo(()=>{
    const now=new Date(); let rows=list.slice();
    if(q.trim()){ const QQ=q.trim().toLowerCase(); rows=rows.filter(b=> b.serviceTitle.toLowerCase().includes(QQ) || (b.customerName||"").toLowerCase().includes(QQ) || (b.phone||"").includes(QQ) || (b.paymentMethod||"").toLowerCase().includes(QQ) ); }
    rows=rows.filter(b=>{ if(filter==="ALL")return true; if(filter==="CANCELLED")return b.status==="CANCELLED"; if(filter==="DONE")return b.status!=="CANCELLED" && (b.completedAt || startAt(b)<=now); return b.status!=="CANCELLED" && !b.completedAt && startAt(b)>now; });
    rows.sort((a,b)=> startAt(a).getTime()-startAt(b).getTime() );
    return rows;
  },[list,filter,q]);
  return (
    <LayoutWrapper>
      <h1 className="text-[15px] font-semibold text-pink-600 mb-3 mt-4">ผู้ดูแล · ประวัติการจอง</h1>
      <section className="rounded-2xl border border-pink-100 bg-white p-3 shadow-sm">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-xl bg-pink-50 py-2"><div className="text-[11px] text-pink-700">ทั้งหมด</div><div className="text-lg font-semibold text-pink-700">{counts.all}</div></div>
          <div className="rounded-xl bg-amber-50 py-2"><div className="text-[11px] text-amber-700">รอเข้ารับบริการ</div><div className="text-lg font-semibold text-amber-700">{counts.pending}</div></div>
          <div className="rounded-xl bg-green-50 py-2"><div className="text-[11px] text-green-700">เข้ารับบริการแล้ว</div><div className="text-lg font-semibold text-green-700">{counts.done}</div></div>
          <div className="rounded-xl bg-rose-50 py-2"><div className="text-[11px] text-rose-700">ยกเลิก</div><div className="text-lg font-semibold text-rose-700">{counts.cancelled}</div></div>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] items-center">
          <input placeholder="ค้นหา: ชื่อ/เบอร์/บริการ/วิธีจ่าย" className="rounded-xl border p-2 text-sm focus:outline-pink-400" value={q} onChange={e=>setQ(e.target.value)} />
          <div className="grid grid-cols-4 gap-2">
            {FILTERS.map(f=>(<button key={f.key} onClick={()=>setFilter(f.key)} className={"h-9 rounded-full text-sm "+(filter===f.key?"bg-pink-500 text-white":"bg-pink-50 text-pink-700 hover:bg-pink-100")}>{f.label}</button>))}
          </div>
        </div>
      </section>
      <section className="mt-4 rounded-2xl border border-pink-100 bg-white overflow-hidden shadow-sm">
        <ul className="divide-y">
          {filtered.map(b=>{
            const isCancelled=b.status==="CANCELLED";
            const isDone=!!b.completedAt || startAt(b)<=new Date();
            const badge=isCancelled?"bg-rose-50 text-rose-700 ring-rose-200": isDone?"bg-green-50 text-green-700 ring-green-200":"bg-amber-50 text-amber-700 ring-amber-200";
            const label=isCancelled?"ยกเลิก": isDone?"เข้ารับบริการแล้ว":"รอเข้ารับบริการ";
            return (
              <li key={b.id} className="p-3">
                <div className="grid sm:grid-cols-12 gap-2 items-start">
                  <div className="sm:col-span-4">
                    <div className="font-medium text-gray-800">{b.serviceTitle}</div>
                    <div className="text-xs text-gray-600">{b.customerName||"-"} {b.phone?`• ${b.phone}`:""}</div>
                  </div>
                  <div className="sm:col-span-3 text-sm text-gray-700">{b.date} • {b.time}<div className="text-[11px] text-gray-400">#{b.id}</div></div>
                  <div className="sm:col-span-2"><span className={`text-[11px] px-2 py-1 rounded-full ring-1 ${badge}`}>{label}</span>{b.completedAt && <div className="text-[11px] text-gray-500 mt-1">เสร็จสิ้น: {new Date(b.completedAt).toLocaleString("th-TH")}</div>}</div>
                  <div className="sm:col-span-3 text-xs text-gray-700">{b.paymentMethod?<>วิธีชำระเงิน: <b>{b.paymentMethod}</b><br/>{b.paidAt?`ชำระแล้ว: ${new Date(b.paidAt).toLocaleString("th-TH")}`:""}</>:<span className="text-gray-400">—</span>}</div>
                </div>
              </li>
            );
          })}
          {filtered.length===0 && <li className="p-6 text-center text-gray-400 text-sm">— ไม่พบรายการ —</li>}
        </ul>
      </section>
    </LayoutWrapper>
  );
}