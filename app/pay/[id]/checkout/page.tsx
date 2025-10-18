"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LayoutWrapper from "../../../components/LayoutWrapper";
import { CreditCard, Wallet, Landmark, QrCode, CircleDollarSign, ShieldCheck } from "lucide-react";

type B = { id:string; serviceId:string; serviceTitle:string; date:string; time:string; createdAt:string; status:"PENDING"|"CONFIRMED"|"CANCELLED"; customerName?:string; phone?:string; promo?:{title?:string;price?:number;oldPrice?:number}; paymentMethod?:string; paidAt?:string; };
const basePrice=(sid:string)=> sid==="svc-01"?890: sid==="svc-02"?690:490;
const finalPrice=(b:B)=> b.promo?.price ?? basePrice(b.serviceId);
function randomRef(){ const n=Math.floor(100000+Math.random()*900000); return `MIN${n}`; }

type PayMethod="PROMPTPAY"|"BANK"|"CARD"|"WALLET"|"CASH";
const METHODS = [
  { key:"PROMPTPAY", title:"PromptPay / พร้อมเพย์", desc:"โอนผ่านพร้อมเพย์", icon: QrCode },
  { key:"BANK", title:"โอนผ่านธนาคาร", desc:"โอนบัญชีธนาคาร", icon: Landmark },
  { key:"CARD", title:"บัตรเครดิต/เดบิต", desc:"ชำระด้วยบัตร", icon: CreditCard },
  { key:"WALLET", title:"วอลเล็ต", desc:"TrueMoney / อื่นๆ", icon: Wallet },
  { key:"CASH", title:"ชำระเงินสดที่ร้าน", desc:"จ่ายหน้างาน", icon: CircleDollarSign },
] as const;

export default function Checkout(){
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [bk,setBk] = useState<B|null>(null);
  const [method,setMethod] = useState<PayMethod>("PROMPTPAY");
  const [agree,setAgree] = useState(false);
  const [loading,setLoading] = useState(false);
  const [fakeRef] = useState(randomRef());

  useEffect(()=>{(async()=>{ const r=await fetch(`/api/bookings/${id}`,{cache:"no-store"}); if(r.ok) setBk(await r.json()); })();},[id]);
  const onConfirmPay = async ()=>{
    if(!bk) return;
    if(!agree) return alert("กรุณาติ๊กยืนยันการชำระเงินก่อน");
    setLoading(true);
    const r = await fetch(`/api/bookings/${id}`,{ method:"PATCH", headers:{ "Content-Type":"application/json"}, body: JSON.stringify({ status:"CONFIRMED", paymentMethod: method, paidAt: new Date().toISOString() })});
    setLoading(false);
    if(!r.ok){ alert("ชำระเงินไม่สำเร็จ"); return; }
    alert(`ชำระเงินสำเร็จ! รหัสยืนยัน: ${fakeRef}`);
    router.push("/all-bookings");
  };

  if(!bk) return <LayoutWrapper>กำลังโหลด…</LayoutWrapper>;
  const amount = finalPrice(bk);

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
              <button key={m.key} type="button" onClick={()=>setMethod(m.key)} className={`text-left rounded-2xl p-3 border ${Active?"border-pink-400 ring-2 ring-pink-100 bg-white":"border-gray-200 hover:bg-pink-50"}`}>
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

        <div className="mt-3 rounded-xl bg-white border border-pink-100 p-3 text-sm">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-pink-600 mt-0.5"/>
            <div className="flex-1">
              <div className="font-medium">ยืนยันการชำระเงิน</div>
              <p className="text-gray-600 text-[13px]">ติ๊กยืนยันเพื่อจบการทำรายการ (ไม่ต้องแนบสลิป/เลขอ้างอิง)</p>
              <label className="mt-2 flex items-center gap-2 text-[13px]">
                <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)}/> ข้าพเจ้ายืนยันว่าได้ชำระเงินเรียบร้อยแล้ว
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <button onClick={()=>history.back()} className="px-5 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50">ย้อนกลับ</button>
          <button onClick={onConfirmPay} disabled={loading||!agree} className="px-6 py-2 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 disabled:opacity-60">{loading?"กำลังดำเนินการ...":"ยืนยันชำระเงิน"}</button>
        </div>
      </div>
    </LayoutWrapper>
  );
}