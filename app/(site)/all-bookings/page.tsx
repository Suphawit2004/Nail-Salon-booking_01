"use client";
import useSWR from "swr";
import { useState, useMemo } from "react";

type Booking = { id:string; serviceTitle:string; date:string; time:string; status:"PENDING"|"PAID"|"DONE"|"CANCELLED"; createdAt:string };

const fetcher = (u:string)=>fetch(u).then(r=>r.json());

const statusBadge = (s:string)=>{
  const map:any = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    PAID: "bg-pink-100 text-pink-700 border-pink-200",
    DONE: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-gray-100 text-gray-600 border-gray-200"
  };
  return `inline-block px-2 py-0.5 text-[11px] rounded-full border ${map[s]||"bg-gray-100 text-gray-600 border-gray-200"}`;
};

const SHOWCASE = ["/work1.jpg","/work2.jpg","/work3.jpg","/idea1.jpg","/idea2.jpg"];

export default function AllBookingsPage(){
  const {data, mutate} = useSWR<Booking[]>("/api/bookings", fetcher, {refreshInterval:5000});
  const [tab,setTab] = useState<"ALL"|"WAITING"|"DONE"|"CANCELLED">("ALL");

  const list = useMemo(()=>{
    const src = (data ?? []).slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
    if(tab==="ALL") return src;
    if(tab==="WAITING") return src.filter(b=>b.status==="PENDING"||b.status==="PAID");
    if(tab==="DONE")    return src.filter(b=>b.status==="DONE");
    return src.filter(b=>b.status==="CANCELLED");
  },[data,tab]);

  const cancel = async(id:string)=>{
    if(!confirm("ยกเลิกรายการนี้?")) return;
    await fetch(`/api/bookings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"CANCELLED"})});
    mutate();
  };

  return (
    <section className="px-4 mt-6 pb-24">
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

      {/* List */}
      <div className="space-y-3">
        {list.map(b=>(
          <article key={b.id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-soft">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{b.serviceTitle}</p>
                <p className="text-xs text-gray-600 mt-1">วันที่ {b.date} • เวลา {b.time}</p>
                <div className="mt-1"><span className={statusBadge(b.status)}>{b.status}</span></div>
              </div>
              <div className="flex gap-2">
                {(b.status==="PENDING"||b.status==="PAID") && <button onClick={()=>cancel(b.id)} className="px-3 py-1.5 rounded-lg border text-xs">ยกเลิก</button>}
              </div>
            </div>
          </article>
        ))}
        {list.length===0 && <div className="text-center text-sm text-gray-500 py-20">--- ไม่พบรายการ ---</div>}
      </div>
    </section>
  );
}
