"use client";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import useSWR from "swr";
import { useState, useMemo } from "react";

type Booking = { id:string; serviceTitle:string; date:string; time:string; status:"PENDING"|"PAID"|"DONE"|"CANCELLED"; createdAt:string };

const fetcher = (u:string)=>fetch(u).then(r=>r.json());

export default function AdminPage(){
  const {data, mutate} = useSWR<Booking[]>("/api/bookings", fetcher, { refreshInterval: 5000 });
  const [tab,setTab] = useState<"ALL"|"WAITING"|"DONE"|"CANCELLED">("ALL");

  const list = useMemo(()=>{
    const src = (data ?? []).slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
    if(tab==="ALL") return src;
    if(tab==="WAITING") return src.filter(b=>b.status==="PENDING"||b.status==="PAID");
    if(tab==="DONE") return src.filter(b=>b.status==="DONE");
    return src.filter(b=>b.status==="CANCELLED");
  }, [data, tab]);

  const markPaid=async(id:string)=>{
    await fetch(`/api/bookings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"PAID"})});
    mutate();
  };
  const markDone=async(id:string)=>{
    await fetch(`/api/bookings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"DONE"})});
    mutate();
  };
  const cancel=async(id:string)=>{
    if(!confirm("ยกเลิกรายการนี้?")) return;
    await fetch(`/api/bookings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"CANCELLED"})});
    mutate();
  };

  return (
    <LayoutWrapper>
      <section className="px-4 pt-4 pb-24">
        <h2 className="text-sm font-semibold text-pink-600 mb-3">ผู้ดูแล — จัดการรายการจอง</h2>

        <div className="mx-auto max-w-md mb-4 rounded-full bg-pink-50 border border-pink-100 grid grid-cols-4 overflow-hidden">
          {[
            {k:"ALL", t:"รายการทั้งหมด"},
            {k:"WAITING", t:"รอรับบริการ"},
            {k:"DONE", t:"เข้ารับบริการแล้ว"},
            {k:"CANCELLED", t:"ยกเลิก"},
          ].map((o:any)=>(
            <button key={o.k} onClick={()=>setTab(o.k)} className={`py-2 text-xs ${tab===o.k?'bg-pink-200/70 font-semibold':''}`}>{o.t}</button>
          ))}
        </div>

        <div className="space-y-3">
          {list.length===0 && <div className="text-center text-sm text-gray-500 py-20">--- ไม่พบรายการ ---</div>}
          {list.map(b=>(
            <article key={b.id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-soft">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{b.serviceTitle}</p>
                  <p className="text-xs text-gray-600 mt-1">วันที่ {b.date} • เวลา {b.time}</p>
                </div>
                <div className="flex gap-2">
                  {b.status==="PENDING" && <button onClick={()=>markPaid(b.id)} className="px-3 py-1.5 rounded-lg bg-pink-600 text-white text-xs">รับชำระ</button>}
                  {(b.status==="PENDING"||b.status==="PAID") && <button onClick={()=>markDone(b.id)} className="px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs">ให้บริการเสร็จสิ้น</button>}
                  {(b.status!=="DONE" && b.status!=="CANCELLED") && <button onClick={()=>cancel(b.id)} className="px-3 py-1.5 rounded-lg border text-xs">ยกเลิก</button>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </LayoutWrapper>
  );
}