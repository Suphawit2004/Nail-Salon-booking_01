"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LayoutWrapper from "../../../components/LayoutWrapper";

type B={id:string;serviceId:string;serviceTitle:string;date:string;time:string;createdAt:string;status:"PENDING"|"CONFIRMED"|"CANCELLED";customerName?:string;phone?:string;promo?:{title?:string;price?:number;oldPrice?:number};};
const basePrice=(sid:string)=>sid==="svc-01"?890:sid==="svc-02"?690:490;
const finalPrice=(b:B)=>b.promo?.price??basePrice(b.serviceId);

export default function Checkout(){
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [bk,setBk] = useState<B|null>(null);

  useEffect(()=>{(async()=>{
    const r = await fetch(`/api/bookings/${id}`,{cache:"no-store"});
    if(r.ok){ setBk(await r.json()); }
  })();},[id]);

  const onPay = async ()=>{
    const r = await fetch(`/api/bookings/${id}`,{
      method:"PATCH",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ status:"CONFIRMED", paymentMethod:"CASH", paidAt:new Date().toISOString() })
    });
    if(!r.ok){ alert("ชำระเงินไม่สำเร็จ"); return; }
    alert("ชำระเงินสำเร็จ!");
    router.push("/all-bookings");
  };

  if(!bk) return <LayoutWrapper>กำลังโหลด…</LayoutWrapper>;
  const amount = finalPrice(bk);

  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mb-3 mt-4">ชำระเงิน</h2>
      <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4">
        <div className="font-semibold text-gray-800 text-lg">{bk.serviceTitle}</div>
        <div className="text-sm text-gray-700 mt-1">วันที่: {bk.date} เวลา: {bk.time}</div>
        {bk.customerName && <div className="text-sm text-gray-700 mt-1">ผู้จอง: {bk.customerName} • {bk.phone}</div>}
        {bk.promo?.title && <div className="text-sm text-rose-700 mt-1">โปร: {bk.promo.title} {bk.promo.price && <>— <b>฿{bk.promo.price.toLocaleString()}</b></>}</div>}
        <div className="text-right mt-2 font-semibold text-rose-600 text-lg">รวม {amount.toLocaleString()}฿</div>
        <div className="mt-4 flex justify-center">
          <button onClick={onPay} className="px-6 py-2 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600">ชำระเงิน</button>
        </div>
      </div>
    </LayoutWrapper>
  );
}
