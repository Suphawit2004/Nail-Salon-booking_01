"use client";
import { useEffect, useState, useCallback } from "react";
type Status = "PENDING" | "DONE" | "CANCELLED";

type Booking = {
  id: string; serviceTitle: string; date: string; time: string; status: Status;
  fullname?: string; phone?: string;
};

export default function AccountAdminPage(){
  const [tab, setTab] = useState<Status>("PENDING");
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      setList(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
    const t = setInterval(fetchList, 5000);
    return () => clearInterval(t);
  }, [fetchList]);

  const update = async (id: string, status: Status) => {
    const ok = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!ok.ok) alert("อัปเดตสถานะไม่สำเร็จ");
    await fetchList();
  };

  const cancel = (id: string) =>
    confirm("ยืนยันยกเลิกการจองนี้?") ? update(id, "CANCELLED") : null;

  const done = (id: string) =>
    confirm("ยืนยันทำรายการนี้ว่า 'เข้ารับบริการแล้ว'?") ? update(id, "DONE") : null;

  const filtered = list.filter(b => b.status === tab);

  return (
    <section className="px-4 pb-28">
      <h2 className="text-sm font-semibold text-pink-600 mb-3">ผู้ดูแล</h2>

      <div className="grid grid-cols-3 text-center text-[12px] rounded-full overflow-hidden ring-1 ring-pink-200 mb-4">
        {(["PENDING","DONE","CANCELLED"] as const).map(k => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`py-1.5 ${tab===k ? "bg-pink-500 text-white" : "bg-pink-50 text-pink-600"}`}
          >
            {k==="PENDING" ? "รอเข้ารับบริการ" : k==="DONE" ? "เสร็จสิ้น" : "ยกเลิก"}
          </button>
        ))}
      </div>

      {loading && <div className="text-center text-xs text-gray-400 mb-2">กำลังโหลด...</div>}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-10">--- ไม่พบรายการ ---</div>
        ) : filtered.map(b => (
          <article key={b.id} className="rounded-2xl bg-pink-50/60 ring-1 ring-pink-100 p-4">
            <div className="flex justify-between gap-3">
              <div>
                <div className="font-semibold text-gray-800">{b.serviceTitle}</div>
                <div className="text-xs text-gray-500 mt-1">
                  วันที่: {b.date} เวลา: {b.time}
                  {b.fullname ? <> · {b.fullname}</> : null}
                  {b.phone ? <> · {b.phone}</> : null}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-gray-400">เลขที่</div>
                <div className="text-xs text-gray-700">#{b.id}</div>
              </div>
            </div>

            {b.status === "PENDING" && (
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => cancel(b.id)}
                  className="px-3 py-1.5 rounded-lg border border-pink-300 text-pink-600 text-xs hover:bg-pink-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => done(b.id)}
                  className="px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs hover:bg-pink-600"
                >
                  เสร็จสิ้น
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
