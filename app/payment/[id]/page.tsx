"use client";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
type Booking = { id:string; serviceId:string; serviceTitle:string; date:string; time:string; price?:number; name?:string; phone?:string; status:"PENDING"|"PAID"|"DONE"|"CANCELLED" };
export default function PaymentPage(){
  const {id}=useParams<{id:string}>(); const router=useRouter();
  const [bk,setBk]=useState<Booking|null>(null); const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [method,setMethod]=useState<"bank"|"promptpay">("bank"); const [loading,setLoading]=useState(false);
  useEffect(()=>{ fetch(`/api/bookings/${id}`).then(r=>r.json()).then((x:Booking)=>{ setBk(x); setName(x.name??""); setPhone(x.phone??""); }); },[id]);
  const pay=async()=>{ if(!name||!phone) return alert("กรอกชื่อและเบอร์โทรก่อนค่ะ"); setLoading(true); const res=await fetch(`/api/bookings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,phone,status:"PAID"})}); setLoading(false); if(!res.ok){alert("บันทึกการชำระเงินไม่สำเร็จ");return;} router.replace("/payment/success"); };
  if(!bk) return <LayoutWrapper><div className="p-4">กำลังโหลด...</div></LayoutWrapper>;
  return (
    <LayoutWrapper>
      <section className="px-4 mt-4">
        <h2 className="text-sm font-semibold text-pink-600 mb-3">ชำระค่าจอง</h2>
        <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4 shadow">
          <div className="flex gap-3">
            <div className="w-24 h-24 rounded-xl bg-white ring-1 ring-pink-100"/>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{bk.serviceTitle}</h3>
              <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                <p>วันที่: {bk.date}</p><p>เวลา: {bk.time}</p><p>จำนวน: 1 ท่าน</p>
              </div>
            </div>
          </div>
          <div className="mt-3 text-right text-sm"><span className="text-gray-500 mr-2">ค่าจอง</span><span className="font-semibold text-pink-600">฿{bk.price ?? 0}</span></div>
        </div>
        <div className="mt-5 rounded-2xl border border-pink-100 bg-white p-4">
          <h4 className="font-semibold text-gray-800">ช่องทางการชำระเงิน</h4>
          <div className="mt-3 flex gap-6 text-sm">
            <label className="flex items-center gap-2"><input type="radio" checked={method==='bank'} onChange={()=>setMethod('bank')}/> โอนผ่านบัญชีธนาคาร</label>
            <label className="flex items-center gap-2"><input type="radio" checked={method==='promptpay'} onChange={()=>setMethod('promptpay')}/> พร้อมเพย์</label>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-600">ชื่อผู้จอง</label><input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-lg border border-pink-200 px-3 py-2 text-sm"/></div>
            <div><label className="text-xs text-gray-600">เบอร์โทร</label><input value={phone} onChange={e=>setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-pink-200 px-3 py-2 text-sm"/></div>
          </div>
          <div className="mt-4"><label className="text-xs text-gray-600">หลักฐานการชำระเงิน (อัปโหลดได้ ไม่บังคับ)</label><div className="mt-1 w-full rounded-lg border border-dashed border-pink-200 bg-pink-50/50 px-3 py-8 text-center text-xs text-gray-500">ลากรูปมาวาง หรือกดเพื่อเลือกไฟล์</div></div>
          <div className="mt-5 flex gap-3 justify-center"><button onClick={()=>history.back()} className="px-5 py-2 rounded-lg border border-gray-200 text-sm">ยกเลิก</button><button onClick={pay} disabled={loading} className="px-5 py-2 rounded-lg bg-pink-500 text-white text-sm disabled:opacity-50">{loading?"กำลังบันทึก...":"ยืนยัน"}</button></div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
