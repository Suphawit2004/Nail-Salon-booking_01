
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BackBar from "@/app/components/BackBar";

// Config เวลา
const START = "10:00";
const END = "19:00";
const STEP = 30; // นาที

// helper
function gen(start = START, end = END, step = STEP) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const out: string[] = [];
  for (let m = sh * 60 + sm; m <= eh * 60 + em; m += step) {
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    out.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return out;
}
function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function SelectPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const serviceId = sp.get("serviceId") ?? "svc-01";

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(todayStr);
  const [time, setTime] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  const slots = useMemo(() => gen(), []);

  const isPastToday = (slot: string, dIso: string) => {
    if (dIso !== todayStr) return false;
    const nowMins = today.getHours() * 60 + today.getMinutes();
    return toMinutes(slot) <= nowMins;
  };

  const availableSlots = (dIso: string) =>
    slots.filter((s) => !isPastToday(s, dIso));

  // หา "วันแรก" ที่ยังมีสลอตให้เลือก (เริ่มจาก date ปัจจุบัน)
  const firstAvailableDate = (fromIso: string) => {
    for (let i = 0; i < 31; i++) {
      const d = addDays(fromIso, i);
      if (availableSlots(d).length > 0) return d;
    }
    return fromIso; // เผื่อกรณีผิดปกติ
  };

  // เมื่อเปิดหน้า หรือวันที่เปลี่ยน: ถ้าวันนั้นเลือกเวลาไม่ได้ → ข้ามไปวันถัดไปอัตโนมัติ
  useEffect(() => {
    const nextDate = firstAvailableDate(date);
    if (nextDate !== date) {
      setDate(nextDate);
      setTime("");
      setInfo(`เวลาของวันที่เลือกไม่สามารถจองได้แล้ว จึงข้ามไปวันที่ ${nextDate}`);
    } else {
      setInfo("");
      // auto-เลือกสลอตแรกที่จองได้เพื่อความเร็ว
      const first = availableSlots(date)[0];
      if (first) setTime(first);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const onDateChange = (v: string) => {
    setTime("");
    setDate(v);
  };

  const next = () => {
    if (!date || !time) return alert("กรุณาเลือกวันและเวลา");
    router.push(`/reserve/confirm?serviceId=${serviceId}&date=${date}&time=${time}`);
  };

  return (
    <>
      <BackBar title="เลือกวัน & เวลา" href="/booking" />
      <section className="px-4 mt-4 pb-24">
        {/* การ์ดหลัก สไตล์เหมือนหน้าหลัก */}
        <div className="card p-4">
          <h2 className="text-pink-600 font-semibold">เลือกวัน–เวลา</h2>
          <p className="text-xs text-gray-600 mt-1">
            เลือกช่วงเวลาที่สะดวก ระบบจะข้ามไปวันถัดไปอัตโนมัติถ้าวันนี้เต็ม/เลยเวลาแล้ว
          </p>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-soft mt-4">
          {info && (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {info}
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm font-medium">วันที่</label>
            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-pink-200 px-3 py-2"
              min={todayStr}
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">เวลา</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {availableSlots(date).map((s) => {
                const active = time === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTime(s)}
                    className={[
                      "py-2 rounded-xl border text-sm",
                      active
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-white border-pink-200",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={next}
              className="px-4 py-2 rounded-xl bg-pink-500 text-white text-sm"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
