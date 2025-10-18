"use client";
import { useEffect, useState } from "react";
import LayoutWrapper from "../components/LayoutWrapper";

type Booking = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  date: string;
  time: string;
  status: "PENDING" | "PAID" | "DONE" | "CANCELLED";
  createdAt: string;
};

export default function AllBookingsPage() {
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const r = await fetch("/api/bookings", { cache: "no-store" });
      const d = await r.json();
      setList(Array.isArray(d) ? d : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, []);

  const cancel = async (id: string) => {
    await fetch("/api/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "CANCELLED" }),
    });
    load();
  };

  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mt-4">
        จองทั้งหมด (อัปเดตอัตโนมัติ)
      </h2>

      <div className="space-y-3 mt-3 pb-24">
        {loading && <div className="text-center text-gray-500">กำลังโหลด...</div>}

        {!loading && list.length === 0 && (
          <div className="text-center text-gray-500 mt-10">--- ไม่พบรายการ ---</div>
        )}

        {list.map((b) => (
          <div key={b.id} className="rounded-xl border border-pink-100 p-3 bg-white shadow-sm">
            <div className="font-semibold text-gray-800">{b.serviceTitle}</div>
            <div className="text-sm text-gray-600 mt-1">
              วันที่: {b.date} เวลา: {b.time}
            </div>
            <div className="text-xs text-gray-500 mt-1">สถานะ: {b.status}</div>

            {b.status !== "CANCELLED" && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => cancel(b.id)}
                  className="px-3 py-1 rounded-lg text-xs border border-gray-300 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </LayoutWrapper>
  );
}
