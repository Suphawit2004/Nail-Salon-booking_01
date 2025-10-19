"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BackBar from "@/app/components/BackBar";

/** Config */
const START = "10:00";
const END = "19:00";
const STEP = 30;

/** Helpers */
const fmtLocal = (d: Date) => {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};
const addDaysLocal = (iso: string, n: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return fmtLocal(dt);
};
const genSlots = (start = START, end = END, step = STEP) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const out: string[] = [];
  for (let m = sh * 60 + sm; m <= eh * 60 + em; m += step) {
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    out.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return out;
};
const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export default function SelectPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const serviceId = sp.get("serviceId") ?? "svc-01";

  const todayStr = fmtLocal(new Date());
  const [date, setDate] = useState<string>(todayStr);
  const [time, setTime] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  const slots = useMemo(() => genSlots(), []);

  const isPastToday = (slot: string, dIso: string) => {
    if (dIso !== todayStr) return false;
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    return toMinutes(slot) <= current;
  };
  const availableSlots = (dIso: string) =>
    slots.filter((s) => !isPastToday(s, dIso));

  const firstAvailableDate = (fromIso: string) => {
    for (let i = 0; i < 31; i++) {
      const d = addDaysLocal(fromIso, i);
      if (availableSlots(d).length > 0) return d;
    }
    return fromIso;
  };

  // Mount: ถ้าวันนี้ใช้ไม่ได้ เลื่อนไปวันแรกที่จองได้
  useEffect(() => {
    const next = firstAvailableDate(todayStr);
    if (next !== todayStr) {
      setDate(next);
      setInfo(`เวลาของวันที่เลือกไม่สามารถจองได้แล้ว จึงข้ามไปวันที่ ${next}`);
      setTime(availableSlots(next)[0] ?? "");
    } else {
      setInfo("");
      setTime(availableSlots(todayStr)[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDateChange = (v: string) => {
    const next = firstAvailableDate(v);
    if (next !== v) {
      setInfo(`วันดังกล่าวเลือกเวลาไม่ได้ ระบบเลื่อนไป ${next}`);
      setDate(next);
      setTime(availableSlots(next)[0] ?? "");
    } else {
      setInfo("");
      setDate(v);
      setTime(availableSlots(v)[0] ?? "");
    }
  };

  const nextStep = () => {
    if (!date || !time) return alert("กรุณาเลือกวันและเวลา");
    router.push(`/reserve/confirm?serviceId=${serviceId}&date=${date}&time=${time}`);
  };

  return (
    <>
      <BackBar title="เลือกวัน & เวลา" href="/booking" />

      <section className="px-4 pt-4 pb-28">
        <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm">
          <h2 className="text-pink-600 font-semibold">เลือกวัน–เวลา</h2>
          <p className="text-xs text-gray-600 mt-1">
            เลือกช่วงเวลาที่สะดวก หากวัน/เวลาที่เลือกใช้ไม่ได้ ระบบจะเลื่อนไปวันถัดไปอัตโนมัติ
          </p>
        </div>

        <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-[0_8px_24px_rgba(255,105,180,.15)] mt-4">
          {info && (
            <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {info}
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm font-medium">วันที่</label>
            <div className="relative mt-2">
              <input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="h-11 w-full rounded-2xl border border-pink-200 bg-white px-4 pr-10 text-sm outline-none focus:border-pink-400"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M7 2v2H5a2 2 0 0 0-2 2v1h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 7H3v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9Z" fill="currentColor"/>
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">เวลา</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots(date).map((s) => {
                const active = time === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTime(s)}
                    className={[
                      "h-11 w-full rounded-2xl border text-sm transition",
                      active
                        ? "bg-pink-500 text-white border-pink-500 shadow"
                        : "bg-white text-gray-700 border-pink-200 hover:border-pink-400",
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
              onClick={nextStep}
              className="px-5 h-11 rounded-2xl bg-pink-500 text-white text-sm shadow hover:bg-pink-600"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
