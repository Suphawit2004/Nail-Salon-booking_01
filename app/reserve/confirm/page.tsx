"use client";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { SERVICES } from "@/lib/catalog";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
export default function ConfirmPage(){
  const q=useSearchParams(); const router=useRouter();
  const serviceId=q.get("serviceId")??""; const date=q.get("date")??""; const time=q.get("time")??"";
  const s = SERVICES[serviceId]; const [loading,setLoading]=useState(false);
  const create=async()=>{
    setLoading(true);
    const res=await fetch("/api/bookings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serviceId,date,time})});
    if(!res.ok){const e=await res.json().catch(()=>({})); alert(`สร้างการจองไม่สำเร็จ (${res.status}) : ${e?.message??"error"}`); setLoading(false); return;}
    const bk=await res.json(); router.push(`/payment/${bk.id}`);
  };
  return (
    <LayoutWrapper>
      <section className="px-4 mt-4">
        <h2 className="text-sm font-semibold text-pink-600 mb-3">ยืนยันการจอง</h2>
        <div className="rounded-2xl border border-pink-100 bg-pink-50/60 shadow p-4">
          <h3 className="font-semibold text-gray-800">{s.title}</h3>
          <div className="mt-3 text-sm text-gray-700 space-y-1"><p>วันที่: <span className="font-medium">{date}</span></p><p>เวลา: <span className="font-medium">{time}</span></p></div>
          <div className="mt-5 flex justify-center"><button onClick={create} disabled={loading} className="px-6 py-2 rounded-xl bg-pink-400 text-white text-sm disabled:opacity-50">{loading?"กำลังสร้าง...":"ยืนยันจอง"}</button></div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
