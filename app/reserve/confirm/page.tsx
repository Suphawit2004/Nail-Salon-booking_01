"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SERVICES } from "@/lib/catalog";
import BackBar from "@/app/components/BackBar";

export default function ConfirmPage(){
  const q = useSearchParams();
  const router = useRouter();
  const serviceId = q.get("serviceId") ?? "";
  const date = q.get("date") ?? "";
  const time = q.get("time") ?? "";
  const s = SERVICES[serviceId];
  const [loading, setLoading] = useState(false);

  const createAndGo = async () => {
    if(!serviceId || !date || !time || !s){ alert("ข้อมูลไม่ครบ"); return; }
    setLoading(true);
    try{
      const r = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          serviceTitle: s.title,
          date,
          time
        }),
      });
      if(!r.ok){ throw new Error("fail"); }
      const bk = await r.json();
      router.push(`/payment/${bk.id}`);
    }catch(e){
      alert("สร้างการจองไม่สำเร็จ");
    }finally{
      setLoading(false);
    }
  };

  const backHref = serviceId ? `/reserve/select?serviceId=${serviceId}` : "/reserve/select";

  return (
    <>
      <BackBar title="ยืนยันการจอง" href={backHref} />
      <section className="px-4 mt-4 pb-24">
        <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-soft">
          <div className="flex gap-4">
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-pink-50 border border-pink-100 shrink-0">
              <img src={s?.img || "/work1.jpg"} alt={s?.title || "service"} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{s?.title || "เลือกบริการ"}</p>
              <p className="text-xs text-gray-600 mt-1">วันที่ {date || "-"} • เวลา {time || "-"}</p>
              {s ? <p className="text-pink-600 font-semibold mt-2">฿{s.price.toLocaleString()}</p> : null}
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={createAndGo}
              disabled={loading || !s || !date || !time}
              className="px-4 py-2 rounded-xl bg-pink-500 text-white text-sm disabled:opacity-50"
            >
              {loading ? "กำลังสร้างการจอง…" : "ยืนยัน"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
