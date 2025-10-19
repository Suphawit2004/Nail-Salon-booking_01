"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SERVICES } from "@/lib/catalog";
import BackBar from "@/app/components/BackBar";

type Booking = { id:string; serviceId:string; serviceTitle:string; date:string; time:string; status:"PENDING"|"PAID"|"DONE"|"CANCELLED"; createdAt:string };

export default function PayPage(){
  const { id } = useParams<{id:string}>();
  const [b, setB] = useState<Booking | null>(null);

  useEffect(()=>{
    if(!id) return;
    fetch(`/api/bookings/${id}`).then(r=>r.json()).then(setB).catch(()=>setB(null));
  },[id]);

  if(!b) return <section className="px-4 py-16 text-center text-sm text-gray-500">กำลังโหลด…</section>;

  const svc = SERVICES[b.serviceId] || undefined;
  const price = svc?.price ?? 0;
  const img = svc?.img ?? "/work1.jpg";

  const pay = async()=>{
    await fetch(`/api/bookings/${b.id}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ status:"PAID" }) });
    location.href = "/payment/success";
  };

  return (
    <>
      <BackBar title="ชำระเงิน" href="/all-bookings" />
      <section className="px-4 mt-4 pb-24">
        <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow">
          <div className="flex gap-4">
            <div className="h-28 w-28 rounded-2xl overflow-hidden bg-pink-50 border border-pink-100 shrink-0">
              <img src={img} alt={b.serviceTitle} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{b.serviceTitle}</p>
              <p className="text-xs text-gray-600 mt-1">วันที่ {b.date} • เวลา {b.time}</p>
              <p className="text-pink-600 font-semibold mt-2">฿{price.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button onClick={pay} className="px-4 py-2 rounded-2xl bg-pink-500 text-white text-sm">
              ยืนยันชำระ ฿{price.toLocaleString()}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
