"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CalendarDays, Clock, CreditCard, Landmark } from "lucide-react";
import LayoutWrapper from "../../components/LayoutWrapper";

type Booking = {
  id: string; serviceId: string; serviceTitle: string; date: string; time: string;
  createdAt: string; status: "PENDING" | "CONFIRMED" | "CANCELLED";
  paymentMethod?: string; paymentRef?: string; paidAt?: string;
};

const priceOf = (sid: string) => (sid === "svc-01" ? 890 : sid === "svc-02" ? 690 : 490);

export default function PayPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<"bank" | "promptpay">("bank");
  const [ref, setRef] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setBooking(data);
          if (data.paymentMethod) setMethod(data.paymentMethod);
          if (data.paymentRef) setRef(data.paymentRef);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const confirmPayment = async () => {
    if (!ref.trim()) {
      alert("กรุณากรอกเลขอ้างอิงการโอน/แนบสลิป");
      return;
    }
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "CONFIRMED",
        paymentMethod: method,
        paymentRef: ref.trim(),
        paidAt: new Date().toISOString(),
      }),
    });
    router.push("/all-bookings");
  };

  if (loading) return <LayoutWrapper>กำลังโหลด…</LayoutWrapper>;
  if (!booking) return <LayoutWrapper>ไม่พบข้อมูลการจอง</LayoutWrapper>;

  const price = priceOf(booking.serviceId);

  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mb-3 mt-4">การจ่ายเงิน</h2>

      <div className="rounded-3xl border border-pink-100 bg-pink-50/60 p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="relative w-[100px] h-[100px] rounded-2xl bg-white ring-1 ring-pink-100" />
          <div className="flex-1">
            <div className="font-semibold text-gray-800 text-lg">{booking.serviceTitle}</div>
            <div className="mt-2 space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-pink-500"/><span>{booking.date}</span></div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-pink-500"/><span>{booking.time}</span></div>
            </div>
            <div className="mt-3 border-t border-pink-100 pt-2 flex justify-end text-sm">
              <span className="font-semibold text-pink-700 mr-2">ค่าจอง</span>
              <span className="font-semibold text-pink-700">{price.toLocaleString()}฿</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        <label className="rounded-2xl border border-pink-100 p-4 flex gap-3 cursor-pointer">
          <input type="radio" name="paymethod" checked={method==="bank"} onChange={()=>setMethod("bank")} className="mt-1"/>
          <div><div className="flex items-center gap-2 font-medium"><Landmark className="h-4 w-4 text-pink-500"/> โอนผ่านธนาคาร</div><div className="text-xs text-gray-500">ชื่อบัญชี: มินเล็บสวย • xxx-x-xxxxx-x</div></div>
        </label>
        <label className="rounded-2xl border border-pink-100 p-4 flex gap-3 cursor-pointer">
          <input type="radio" name="paymethod" checked={method==="promptpay"} onChange={()=>setMethod("promptpay")} className="mt-1"/>
          <div><div className="flex items-center gap-2 font-medium"><CreditCard className="h-4 w-4 text-pink-500"/> PromptPay / QR</div><div className="text-xs text-gray-500">สแกน QR และกรอกเลขอ้างอิง</div></div>
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-700">หลักฐานการชำระเงิน</div>
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          <div>
            <div className="text-xs text-gray-500 mb-1">อัปโหลดสลิป (ตัวอย่าง)</div>
            <input type="file" className="text-xs"/>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">เลขอ้างอิง *</div>
            <input value={ref} onChange={(e)=>setRef(e.target.value)} className="w-full border rounded-xl p-2 text-sm focus:outline-pink-400" placeholder="เช่น 0123456789"/>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button onClick={()=>history.back()} className="px-5 py-2 rounded-xl border border-pink-200 text-sm hover:bg-pink-50">ย้อนกลับ</button>
        <button onClick={confirmPayment} className="px-6 py-2 rounded-xl bg-pink-400 text-white text-sm font-semibold hover:bg-pink-500">ยืนยันชำระเงิน</button>
      </div>
    </LayoutWrapper>
  );
}
