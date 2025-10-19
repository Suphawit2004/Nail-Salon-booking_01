"use client";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { useEffect, useState } from "react";

type Booking = {
  id: string;
  serviceTitle: string;
  date: string;
  time: string;
  status: "PENDING" | "PAID" | "DONE" | "CANCELLED";
};

type Tab = "WAITING" | "DONE" | "CANCELLED";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("WAITING");
  const [list, setList] = useState<Booking[]>([]);

  const load = () => {
    if (tab === "WAITING") {
      fetch(`/api/bookings`)
        .then((r) => r.json())
        .then((all: Booking[]) => {
          const filtered = (all || []).filter(
            (b) => b.status === "PENDING" || b.status === "PAID"
          );
          setList(filtered);
        })
        .catch(() => setList([]));
    } else {
      fetch(`/api/bookings?status=${tab}`)
        .then((r) => r.json())
        .then((x) => setList(x || []))
        .catch(() => setList([]));
    }
  };

  useEffect(() => { load(); }, [tab]);

  const markDone = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "DONE" }),
    });
    load();
  };

  const cancel = async (id: string) => {
    if (!confirm("ยกเลิกรายการนี้?")) return;
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    load();
  };

  const labelOf = (k: Tab) =>
    k === "WAITING" ? "รอเข้ารับบริการ" : k === "DONE" ? "เข้ารับบริการแล้ว" : "ยกเลิก";

  const TABS: Tab[] = ["WAITING", "DONE", "CANCELLED"];

  return (
    <LayoutWrapper>
      <section className="px-4 pt-4">
        <h2 className="text-sm font-semibold text-pink-600 mb-3">
          ผู้ดูแล — จัดการรายการจอง
        </h2>

        <div className="mx-auto max-w-md mb-4 rounded-full bg-pink-50 border border-pink-100 grid grid-cols-3 overflow-hidden">
          {TABS.map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={[
                "py-2 text-sm",
                k === tab ? "bg-pink-200/60 font-semibold" : "hover:bg-pink-100",
              ].join(" ")}
            >
              {labelOf(k)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {list.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-20">
              --- ไม่พบรายการ ---
            </div>
          )}

          {list.map((b) => (
            <article
              key={b.id}
              className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{b.serviceTitle}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    วันที่ {b.date} • เวลา {b.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  {tab === "WAITING" && (
                    <>
                      <button
                        onClick={() => markDone(b.id)}
                        className="px-3 py-1.5 rounded-lg border text-xs"
                      >
                        ทำสำเร็จ
                      </button>
                      <button
                        onClick={() => cancel(b.id)}
                        className="px-3 py-1.5 rounded-lg border text-xs"
                      >
                        ยกเลิก
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </LayoutWrapper>
  );
}
