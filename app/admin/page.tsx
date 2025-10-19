
"use client";

import { useEffect, useState } from "react";
import { SERVICES } from "@/lib/catalog";
type Booking = { id:string; serviceId:string; serviceTitle:string; date:string; time:string; status:"PENDING"|"PAID"|"DONE"|"CANCELLED"; createdAt:string };

const TABS = [
  { key:"PENDING", label:"รอเข้ารับบริการ" },
  { key:"PAID", label:"ชำระแล้ว" },
  { key:"DONE", label:"เข้ารับบริการแล้ว" },
  { key:"CANCELLED", label:"ยกเลิก" },
] as const;

export default function AdminPage(){
  const [tab, setTab] = useState<typeof TABS[number]["key"]>("PENDING");
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async ()=>{
    setLoading(true);
    const r = await fetch("/api/bookings");
    const list:Booking[] = await r.json();
    setItems(list);
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const update = async (id:string, status:Booking["status"])=>{
    await fetch(`/api/bookings/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status }) });
    load();
  };

  const filtered = items.filter(x=>x.status===tab);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="grid grid-cols-4 gap-2">
          {TABS.map(t=> (
            <button key={t.key} onClick={()=>setTab(t.key)}
              className={(tab===t.key? "bg-pink-500 text-white" : "bg-white text-gray-700")+" rounded-2xl border border-pink-200 px-3 py-2 text-sm"}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-sm text-gray-500 py-20">กำลังโหลด…</div>
      ) : filtered.length===0 ? (
        <div className="text-center text-sm text-gray-500 py-20">--- ไม่พบรายการ ---</div>
      ) : filtered.map(b=>{
        const svc = SERVICES[b.serviceId]; const img = svc?.img || "/work1.jpg";
        return (
          <div key={b.id} className="service-card">
            <div className="service-thumb">
              <img src={img} alt={b.serviceTitle} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{b.serviceTitle}</p>
              <p className="text-xs text-gray-600 mt-1">วันที่ {b.date} • เวลา {b.time}</p>
            </div>
            <div className="flex gap-2">
              {b.status==="PENDING" && (
                <>
                  <button onClick={()=>update(b.id,"PAID")} className="btn-outline">รับชำระ</button>
                  <button onClick={()=>update(b.id,"CANCELLED")} className="btn-outline">ยกเลิก</button>
                </>
              )}
              {b.status==="PAID" && (
                <button onClick={()=>update(b.id,"DONE")} className="btn-primary">ให้บริการเสร็จสิ้น</button>
              )}
              {b.status==="DONE" && (
                <button disabled className="btn-ghost opacity-60">เสร็จแล้ว</button>
              )}
              {b.status==="CANCELLED" && (
                <button disabled className="btn-ghost opacity-60">ยกเลิกแล้ว</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
