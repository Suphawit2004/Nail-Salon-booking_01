"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import LayoutWrapper from "../../components/LayoutWrapper";

export default function CustomerFormPage(){
  const q = useSearchParams();
  const router = useRouter();
  const serviceId = q.get("serviceId") ?? "";
  const date = q.get("date") ?? "";
  const time = q.get("time") ?? "";
  const title = serviceId==="svc-01" ? "ถอดPVC และต่อเล็บ" : serviceId==="svc-02" ? "ถอดpvc ทาสีเจล" : "ทาสีเจล";

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");

  const onSubmit = async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!name.trim()) return alert("กรอกชื่อผู้จอง");
    if(!/^0\d{8,9}$/.test(phone)) return alert("กรอกเบอร์โทร 10 หลักให้ถูกต้อง");

    const res = await fetch("/api/bookings", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ serviceId, serviceTitle:title, date, time, customerName:name.trim(), phone })
    });
    const data = await res.json();
    if(!res.ok){ alert(data?.error || "สร้างการจองไม่สำเร็จ"); return; }
    router.push(`/payment/${data.id}`);
  };

  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mt-4">ข้อมูลผู้จอง</h2>

      <form onSubmit={onSubmit} className="mt-3 rounded-[18px] bg-pink-50 ring-1 ring-pink-100 p-4 shadow-[0_10px_24px_rgba(255,182,193,.18)]">
        <div className="text-sm text-gray-700">
          <div>บริการ: <span className="font-semibold">{title}</span></div>
          <div className="mt-1">วันที่: {date} เวลา: {time}</div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-1">ชื่อผู้จอง</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300"/>
        </div>

        <div className="mt-3">
          <label className="block text-xs text-gray-600 mb-1">เบอร์โทร</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} inputMode="tel" placeholder="0XXXXXXXXX" className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300"/>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="submit" className="px-5 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600">ถัดไป</button>
        </div>
      </form>
    </LayoutWrapper>
  );
}
