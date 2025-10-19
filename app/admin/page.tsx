"use client";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { useEffect, useState } from "react";
type Booking = { id:string; serviceTitle:string; date:string; time:string; status:"PENDING"|"PAID"|"DONE"|"CANCELLED" };
export default function AdminPage(){
  const [tab,setTab]=useState<"PENDING"|"PAID"|"DONE"|"CANCELLED">("PENDING");
  const [list,setList]=useState<Booking[]>([]);
  const load=()=>fetch(`/api/bookings?status=${tab}`).then(r=>r.json()).then(setList).catch(()=>setList([]));
  useEffect(()=>{load();},[tab]);
  const markPaid=async(id:string)=>{await fetch(`/api/bookings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"PAID"})}); load();};
  const markDone=async(id:string)=>{await fetch(`/api/bookings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"DONE"})}); load();};
  const cancel=async(id:string)=>{if(!confirm("ยกเลิกรายการนี้?"))return; await fetch(`/api/bookings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"CANCELLED"})}); load();};
  return (
    <LayoutWrapper>
      <section className="px-4 pt-4">
        <h2 className="text-sm font-semibold text-pink-600 mb-3">ผู้ดูแล — จัดการรายการจอง</h2>
        <div className="mx-auto max-w-md mb-4 rounded-full bg-pink-50 border border-pink-100 grid grid-cols-4 overflow-hidden">
          {["PENDING","PAID","DONE","CANCELLED"].map(k=>(<button key={k} onClick={()=>setTab(k as any)} className={`py-2 text-xs ${tab===k?'bg-pink-200/70 font-semibold':''}`}>{k==="PENDING"?"รอเข้ารับบริการ":k==="DONE"?"เข้ารับบริการแล้ว":"ยกเลิก"}</button>))}
        </div>
        <div className="space-y-3">
          {list.length===0 && <div className="text-center text-sm text-gray-500 py-20">--- ไม่พบรายการ ---</div>}
          {list.map(b=>(
            <article key={b.id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
              <div className="flex justify-between items-center"><div><h3 className="font-semibold text-gray-800">{b.serviceTitle}</h3><p className="text-xs text-gray-600 mt-1">วันที่ {b.date} • เวลา {b.time}</p></div>
              <div className="flex gap-2">{tab==="PENDING"&&<button onClick={()=>markPaid(b.id)} className="px-3 py-1.5 rounded-lg bg-pink-600 text-white text-xs">รับชำระ</button>}{tab==="PENDING"&&<button onClick={()=>markDone(b.id)} className="px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs">ให้บริการเสร็จสิ้น</button>}{tab==="PENDING"&&<button onClick={()=>markPaid(b.id)} className="px-3 py-1.5 rounded-lg bg-pink-600 text-white text-xs">รับชำระ</button>}{tab==="PENDING"&&<button onClick={()=>cancel(b.id)} className="px-3 py-1.5 rounded-lg border text-xs">ยกเลิก</button>}</div></div>
            </article>
          ))}
        </div>
      </section>
    </LayoutWrapper>
  );
}
