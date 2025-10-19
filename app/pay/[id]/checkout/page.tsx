"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
const DEPOSIT = 100;
const BANK_INFO = { bank: "กสิกรไทย (KBank)", name: "Min Nail Studio", number: "123-4-56789-0" };
const PROMPTPAY_INFO = { id: "081-234-5678" }; // ตัวอย่าง พร้อมเพย์ (สมมติ)

import LayoutWrapper from "../../../components/LayoutWrapper";
import { Landmark, QrCode, Copy } from "lucide-react";

type B = { id:string; serviceId:string; serviceTitle:string; date:string; time:string; createdAt:string; status:"PENDING"|"CONFIRMED"|"CANCELLED"; customerName?:string; phone?:string; promo?:{title?:string;price?:number;oldPrice?:number}; paymentMethod?:string; paidAt?:string; };
const basePrice=(sid:string)=> sid==="svc-01"?890: sid==="svc-02"?690:490;
const finalPrice=(b:B)=> b.promo?.price ?? basePrice(b.serviceId);
function randomRef(){ const n=Math.floor(100000+Math.random()*900000); return `MIN${n}`; }

type PayMethod = "PROMPTPAY"|"BANK";
const METHODS = [
  { key:"PROMPTPAY", title:"PromptPay / พร้อมเพย์", desc:"โอนผ่านพร้อมเพย์", icon: QrCode },
  { key:"BANK", title:"โอนผ่านธนาคาร", desc:"โอนบัญชีธนาคาร", icon: Landmark },
] as const;

export default function Checkout(){
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [bk,setBk] = useState<B|null>(null);
  const [method,setMethod] = useState<PayMethod>("PROMPTPAY");
  const [slip, setSlip] = useState<File|null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading,setLoading] = useState(false);
  const [fakeRef] = useState(randomRef());

  const copyText = async (t:string)=>{ try{ await navigator.clipboard.writeText(t); alert("คัดลอกแล้ว"); }catch{} };

  const BankPanel = () => (
    <div className="rounded-2xl border border-pink-200 bg-pink-50/70 p-3">
      <div className="text-sm">โอนเข้าบัญชีธนาคาร</div>
      <div className="mt-2 grid grid-cols-[100px_1fr] gap-y-1 text-sm max-sm:grid-cols-1">
        <div className="text-gray-600">ธนาคาร</div><div className="font-medium">{BANK_INFO.bank}</div>
        <div className="text-gray-600">ชื่อบัญชี</div><div className="font-medium">{BANK_INFO.name}</div>
        <div className="text-gray-600">เลขบัญชี</div>
        <div className="flex items-center gap-2 font-mono">
          {BANK_INFO.number}
          <button type="button" onClick={()=>copyText(BANK_INFO.number)} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 border rounded-md">
            <Copy className="h-3 w-3"/> คัดลอก
          </button>
        </div>
      </div>
      <div className="mt-2 text-right text-pink-700 font-semibold">ยอดชำระ {amount.toLocaleString()}฿</div>
    </div>
  );

  const PromptPanel = () => (
    <div className="rounded-2xl border border-pink-200 bg-pink-50/70 p-3">
      <div className="text-sm mb-2">พร้อมเพย์ (PromptPay)</div>
      <div className="flex items-start gap-3 max-sm:flex-col">
        <div className="shrink-0">
          {/* QR Placeholder (จำลอง) */}
          <svg width="120" height="120" viewBox="0 0 120 120">
            <rect width="120" height="120" fill="#fff" stroke="#e5e7eb"/>
            <rect x="10" y="10" width="28" height="28" fill="#111"/>
            <rect x="82" y="10" width="28" height="28" fill="#111"/>
            <rect x="10" y="82" width="28" height="28" fill="#111"/>
            <rect x="50" y="50" width="6" height="6" fill="#111"/>
            <rect x="62" y="50" width="6" height="6" fill="#111"/>
            <rect x="50" y="62" width="6" height="6" fill="#111"/>
            <rect x="62" y="62" width="6" height="6" fill="#111"/>
            <rect x="74" y="74" width="10" height="10" fill="#111"/>
          </svg>
        </div>
        <div className="flex-1 text-sm">
          <div>PromptPay ID: <span className="font-mono font-medium">{PROMPTPAY_INFO.id}</span>
            <button type="button" onClick={()=>copyText(PROMPTPAY_INFO.id)} className="ml-2 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 border rounded-md">
              <Copy className="h-3 w-3"/> คัดลอก
            </button>
          </div>
          <div className="mt-2 text-pink-700 font-semibold">ยอดชำระ {amount.toLocaleString()}฿</div>
          <div className="mt-1 text-[11px] text-gray-500">*สแกน/โอนแล้วแนบสลิปด้านล่าง</div>
        </div>
      </div>
    </div>
  );
useEffect(()=>{(async()=>{ const r=await fetch(`/api/bookings/${id}`,{cache:"no-store"}); if(r.ok) setBk(await r.json()); })();},[id]);
  
  const onConfirmPay = async () => {
    if(!bk) return;
    if(!slip) return alert("โปรดแนบสลิปการโอนเงิน");
    setLoading(true);
    try{
      const fd = new FormData();
      fd.append("paymentMethod", method);
      fd.append("slip", slip);
      const r = await fetch(`/api/bookings/${id}`, { method:"PATCH", body: fd });
      setLoading(false);
      if(!r.ok){ alert("ชำระเงินไม่สำเร็จ"); return; }
      alert("ส่งสลิปเรียบร้อย กำลังพาไปหน้ารายการทั้งหมด");
      router.push("/all-bookings");
    }catch(e){
      setLoading(false);
      alert("เกิดข้อผิดพลาดในการอัพโหลดสลิป");
    }
  };
    

  if(!bk) return <LayoutWrapper>กำลังโหลด…</LayoutWrapper>;
  const amount = DEPOSIT;

  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mb-3 mt-4">ชำระค่าจอง</h2>
      <div className="rounded-2xl border p-3">
        <div className="font-semibold">{bk.serviceTitle}</div>
        <div className="text-sm text-gray-600 mt-1">วันที่: {bk.date} เวลา: {bk.time}</div>
        <div className="text-right mt-2 font-semibold text-pink-700">ยอดชำระ {amount.toLocaleString()}฿</div>

        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          {METHODS.map((m)=>{
            const Active = method===m.key;
            const Icon = m.icon as any;
            return (
              <button key={m.key} type="button" onClick={()=>setMethod(m.key)} className={`text-left rounded-2xl p-3 border ${Active?"border-pink-400 ring-2 ring-pink-200 bg-white":"border-gray-200 hover:bg-pink-50"}`}>
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${Active?"text-pink-600":"text-gray-500"}`}/>
                  <div className="flex-1">
                    <div className="font-medium">{m.title}</div>
                    <div className="text-xs text-gray-500">{m.desc}</div>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${Active?"bg-pink-500":"bg-gray-300"}`}/>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 rounded-xl bg-pink-50/60 border border-pink-200 p-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="font-medium">ยืนยันการชำระเงิน</div>
              <div className="mt-3">{method==="BANK" ? <BankPanel/> : <PromptPanel/>}</div>
              <div className="mt-4">
            <p className="text-sm font-medium">แนบสลิปโอนเงิน</p>
            <input type="file" accept="image/*" onChange={(e)=>{ const f=e.target.files?.[0]||null; setSlip(f); setPreview(f?URL.createObjectURL(f):""); }} className="mt-2 block w-full text-sm" />
            {preview && <img src={preview} alt="สลิป" className="mt-2 max-h-60 rounded-lg border" />}
          </div>

          
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <button onClick={()=>history.back()} className="px-5 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50">ย้อนกลับ</button>
          <button onClick={onConfirmPay} disabled={loading || !slip} className="px-6 py-2 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 disabled:opacity-60">{loading?"กำลังดำเนินการ...":"ยืนยันชำระเงิน"}</button>
        </div>
      </div>
    </LayoutWrapper>
  );
}