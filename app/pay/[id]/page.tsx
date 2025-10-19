"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
const DEPOSIT = 100;
import LayoutWrapper from "../../components/LayoutWrapper";

type Booking = { id:string; serviceId:string; serviceTitle:string; date:string; time:string; createdAt:string; status:"PENDING"|"CONFIRMED"|"CANCELLED"; customerName?:string; phone?:string; promo?:{title?:string;price?:number;oldPrice?:number}; };

const basePrice=(sid:string)=> sid==="svc-01"?890: sid==="svc-02"?690:490;
const finalPrice=(b:Booking)=> b.promo?.price ?? basePrice(b.serviceId);

export default function PayInfoPage(){
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [bk,setBk] = useState<Booking|null>(null);
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [saving,setSaving] = useState(false);

  useEffect(()=>{(async()=>{
    const r = await fetch(`/api/bookings/${id}`,{cache:"no-store"});
    if(r.ok){ const d=await r.json(); setBk(d); setName(d.customerName||""); setPhone(d.phone||""); }
  })();},[id]);

  const handleSave = async ()=>{
    if(!name.trim()) return alert("กรุณากรอกชื่อผู้จอง");
    if(!/^0\d{8,9}$/.test(phone.trim())) return alert("กรุณากรอกเบอร์ให้ถูกต้อง");
    setSaving(true);
    const r = await fetch(`/api/bookings/${id}`,{method:"PATCH",headers:{ "Content-Type":"application/json"},body:JSON.stringify({customerName:name.trim(),phone:phone.trim()})});
    setSaving(false);
    if(!r.ok){ alert("บันทึกไม่สำเร็จ"); return; }
    router.replace(`/pay/${id}/checkout`);
  };

  if(!bk) return <LayoutWrapper>กำลังโหลด…</LayoutWrapper>;
  const amount = DEPOSIT;

  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mb-3 mt-4">ข้อมูลผู้จอง</h2>
      <div className="rounded-2xl border border-pink-200 bg-pink-50/60 p-3">
        <div className="font-medium">{bk.serviceTitle}</div>
        <div className="text-sm text-gray-600 mt-1">วันที่: {bk.date} เวลา: {bk.time}</div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <label className="text-sm">ชื่อผู้จอง
            <input value={name} onChange={e=>setName(e.target.value)} className="block w-full mt-1 border rounded-lg p-2"/>
          </label>
          <label className="text-sm">เบอร์โทร
            <input value={phone} onChange={e=>setPhone(e.target.value)} className="block w-full mt-1 border rounded-lg p-2" placeholder="08xxxxxxxx"/>
          </label>
        </div>
        {bk?.code && <div className="mt-2 text-xs text-gray-600">รหัสการจอง: <span className="font-semibold">{bk.code}</span></div>}
        <div className="mt-3 text-right font-semibold text-pink-700">ยอดชำระ {amount.toLocaleString()}฿</div>
        <div className="text-center mt-3">
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl bg-pink-500 text-white text-sm">{saving?"กำลังบันทึก…":"ถัดไป: ชำระเงิน"}</button>
        </div>
        </div>
    </LayoutWrapper>
  );
}