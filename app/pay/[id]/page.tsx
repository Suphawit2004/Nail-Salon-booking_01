"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LayoutWrapper from "../../components/LayoutWrapper";

type Booking = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  date: string;
  time: string;
  createdAt: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  customerName?: string;
  phone?: string;
  promo?: { title?: string; price?: number; oldPrice?: number };
};

const basePrice = (sid: string) => (sid === "svc-01" ? 890 : sid === "svc-02" ? 690 : 490);
const finalPrice = (b: Booking) => b.promo?.price ?? basePrice(b.serviceId);

export default function PayInfoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [bk, setBk] = useState<Booking | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const res = await fetch(`/api/bookings/${id}`, { cache: "no-store" });
      if (!res.ok) {
        alert("ไม่พบรายการจอง");
        return;
      }
      const data: Booking = await res.json();
      setBk(data);
      setName(data.customerName || "");
      setPhone(data.phone || "");
    })();
  }, [id]);

  const handleSave = async (e?: React.MouseEvent) => {
    e?.preventDefault(); // กัน reload
    if (!id) return;
    if (!name.trim()) return alert("กรุณากรอกชื่อผู้จอง");
    if (!/^0\d{8,9}$/.test(phone.trim())) return alert("กรุณากรอกเบอร์โทรให้ถูกต้อง (เช่น 08xxxxxxxx)");

    setSaving(true);
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName: name.trim(), phone: phone.trim() }),
    }).catch(() => null);
    setSaving(false);

    if (!res) return alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    if (!res.ok) {
      const ct = res.headers.get("content-type") || "";
      const body = ct.includes("application/json") ? await res.json() : await res.text();
      alert((body && body.error) || `บันทึกข้อมูลไม่สำเร็จ (${res.status})`);
      return;
    }

    router.replace(`/pay/${id}/checkout`);
  };

  if (!bk) return <LayoutWrapper>กำลังโหลด…</LayoutWrapper>;
  const amount = finalPrice(bk);

  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mb-3 mt-4">ข้อมูลผู้จอง</h2>

      <div className="rounded-3xl border border-pink-100 bg-pink-50/60 p-4 shadow-sm">
        <div className="font-semibold text-gray-800 text-lg">{bk.serviceTitle}</div>
        {bk.promo?.title && (
          <div className="mt-1 text-sm text-rose-700">
            โปร: <b>{bk.promo.title}</b>
            {bk.promo.price && (
              <>
                {" "}
                — <span className="font-semibold">฿{bk.promo.price.toLocaleString()}</span>
                {bk.promo.oldPrice && (
                  <span className="text-gray-400 line-through ml-2 text-xs">
                    ฿{bk.promo.oldPrice.toLocaleString()}
                  </span>
                )}
              </>
            )}
          </div>
        )}
        <div className="mt-2 text-sm text-gray-700">
          วันที่: {bk.date} เวลา: {bk.time}
        </div>
        <div className="mt-2 text-right font-semibold text-pink-700 text-lg">
          ยอดชำระ {amount.toLocaleString()}฿
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            ชื่อผู้จอง
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border p-2 text-sm focus:outline-pink-400"
            />
          </label>
          <label className="text-sm">
            เบอร์โทร
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border p-2 text-sm focus:outline-pink-400"
              placeholder="08xxxxxxxx"
            />
          </label>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => history.back()}
            className="px-5 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50"
          >
            ย้อนกลับ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 disabled:opacity-60"
          >
            {saving ? "กำลังบันทึก..." : "ถัดไป: ชำระเงิน"}
          </button>
        </div>

        <div className="text-center mt-2">
          <a href={`/pay/${bk.id}/checkout`} className="text-xs text-pink-600 underline">
            ไปหน้าชำระเงิน (ลิงก์สำรอง)
          </a>
        </div>
      </div>
    </LayoutWrapper>
  );
}