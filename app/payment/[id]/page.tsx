"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LayoutWrapper from "../../components/LayoutWrapper";

type Booking = {
  id: string;
  serviceTitle: string;
  date: string;
  time: string;
  customerName?: string;
  phone?: string;
  status: "PENDING"|"PAID"|"DONE"|"CANCELLED";
};

export default function PaymentPage(){
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [bk, setBk] = useState<Booking|null>(null);
  const [method,setMethod] = useState("promptpay");

  useEffect(()=>{
    (async()=>{
      const r = await fetch("/api/bookings", { cache:"no-store" });
      const d = await r.json();
      const found = (d||[]).find((x:any)=>x.id===id);
      setBk(found||null);
    })();
  }, [id]);

  const markPaid = async()=>{
    await fetch("/api/bookings", { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ id, status:"PAID" }) });
    alert("บันทึกการชำระเงินเรียบร้อย");
    router.push("/all-bookings");
  };

  const cancel = async()=>{
    await fetch("/api/bookings", { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ id, status:"CANCELLED" }) });
    router.push("/all-bookings");
  };

  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mt-4">ชำระค่าจอง</h2>

      {!bk && <div className="mt-6 text-center text-gray-500">กำลังโหลด...</div>}

      {bk && (
        <div className="mt-3 space-y-4">
          <div className="rounded-[18px] bg-pink-50 ring-1 ring-pink-100 p-4">
            <div className="font-semibold text-gray-800">{bk.serviceTitle}</div>
            <div className="text-sm text-gray-700 mt-1">วันที่: {bk.date} เวลา: {bk.time}</div>
            <div className="text-sm text-gray-700 mt-1">ชื่อผู้จอง: {bk.customerName || "-"}</div>
            <div className="text-sm text-gray-700">โทร: {bk.phone || "-"}</div>
          </div>

          <div className="rounded-[18px] ring-1 ring-pink-100 p-4 bg-white">
            <div className="text-sm font-medium text-gray-800">ช่องทางชำระเงิน</div>
            <div className="mt-3 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" name="pay" checked={method==="promptpay"} onChange={()=>setMethod("promptpay")} />
                PromptPay (ตัวอย่าง)
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="pay" checked={method==="bank"} onChange={()=>setMethod("bank")} />
                โอนบัญชีธนาคาร (ตัวอย่าง)
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="pay" checked={method==="cash"} onChange={()=>setMethod("cash")} />
                ชำระเงินสดหน้าร้าน
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-3">* เดโม: ไม่ต้องอัปโหลดสลิป กด “ยืนยันการชำระ” เพื่อบันทึกสถานะ</p>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={cancel} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">ยกเลิก</button>
              <button onClick={markPaid} className="px-4 py-2 rounded-lg bg-pink-500 text-white text-sm">ยืนยันการชำระ</button>
            </div>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}
