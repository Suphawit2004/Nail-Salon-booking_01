"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LayoutWrapper from "../../../components/LayoutWrapper";
import { CreditCard, Wallet, Landmark, QrCode, CircleDollarSign, ShieldCheck } from "lucide-react";

type B = {
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
  paymentMethod?: string;
  paidAt?: string;
};

const basePrice = (sid: string) => (sid === "svc-01" ? 890 : sid === "svc-02" ? 690 : 490);
const finalPrice = (b: B) => b.promo?.price ?? basePrice(b.serviceId);

function randomRef() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `MIN${n}`;
}

type PayMethod = "PROMPTPAY" | "BANK" | "CARD" | "WALLET" | "CASH";
const METHODS: { key: PayMethod; title: string; desc: string; icon: any }[] = [
  { key: "PROMPTPAY", title: "PromptPay / พร้อมเพย์", desc: "โอนผ่านพร้อมเพย์", icon: QrCode },
  { key: "BANK",      title: "โอนผ่านธนาคาร",         desc: "โอนบัญชีธนาคาร", icon: Landmark },
  { key: "CARD",      title: "บัตรเครดิต/เดบิต",       desc: "ชำระด้วยบัตร",   icon: CreditCard },
  { key: "WALLET",    title: "วอลเล็ต",                desc: "TrueMoney / อื่นๆ", icon: Wallet },
  { key: "CASH",      title: "ชำระเงินสดที่ร้าน",      desc: "จ่ายหน้างาน",     icon: CircleDollarSign },
];

export default function Checkout() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [bk, setBk] = useState<B | null>(null);
  const [method, setMethod] = useState<PayMethod>("PROMPTPAY");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fakeRef, setFakeRef] = useState(randomRef());

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/bookings/${id}`, { cache: "no-store" });
      if (r.ok) setBk(await r.json());
    })();
  }, [id]);

  const onConfirmPay = async () => {
    if (!bk) return;
    if (!agree) return alert("กรุณาติ๊กยืนยันการชำระเงินก่อน");

    setLoading(true);
    const r = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "CONFIRMED",
        paymentMethod: method,
        paidAt: new Date().toISOString(),
      }),
    });
    setLoading(false);

    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      alert(e?.error || "ชำระเงินไม่สำเร็จ");
      return;
    }
    alert(`ชำระเงินสำเร็จ! รหัสยืนยัน: ${fakeRef}`);
    router.push("/all-bookings");
  };

  if (!bk) return <LayoutWrapper>กำลังโหลด…</LayoutWrapper>;
  const amount = finalPrice(bk);

  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mb-3 mt-4">ชำระค่าจอง</h2>

      <div className="rounded-3xl border border-pink-100 bg-pink-50/60 p-4 shadow-sm">
        <div className="font-semibold text-gray-800 text-lg">{bk.serviceTitle}</div>
        <div className="mt-1 text-sm text-gray-700">
          วันที่: {bk.date} เวลา: {bk.time}
        </div>
        {bk.customerName && (
          <div className="text-sm text-gray-700 mt-1">
            ผู้จอง: {bk.customerName} • {bk.phone}
          </div>
        )}
        {bk.promo?.title && (
          <div className="text-sm text-rose-700 mt-1">
            โปร: <b>{bk.promo.title}</b>{" "}
            {bk.promo.price && (
              <>
                — <b>฿{bk.promo.price.toLocaleString()}</b>
                {bk.promo.oldPrice && <span className="text-gray-400 line-through ml-2 text-xs">฿{bk.promo.oldPrice.toLocaleString()}</span>}
              </>
            )}
          </div>
        )}
        <div className="text-right mt-2 font-semibold text-rose-600 text-lg">ยอดชำระ {amount.toLocaleString()}฿</div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="text-sm font-medium">ช่องทางการชำระเงิน</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {METHODS.map(({ key, title, desc, icon: Icon }) => {
            const active = method === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setMethod(key)}
                className={[
                  "text-left rounded-2xl p-3 border transition w-full",
                  active ? "border-pink-400 ring-2 ring-pink-100 bg-white" : "border-gray-200 hover:bg-pink-50"
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <Icon className={["h-5 w-5", active ? "text-pink-600" : "text-gray-500"].join(" ")} />
                  <div className="flex-1">
                    <div className="font-medium">{title}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </div>
                  <div className={"h-3 w-3 rounded-full " + (active ? "bg-pink-500" : "bg-gray-300")} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-2 rounded-xl bg-white border border-pink-100 p-3 text-sm">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-pink-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium">ยืนยันการชำระเงิน</div>
              <p className="text-gray-600 text-[13px]">
                โปรดตรวจสอบยอดและช่องทางชำระเงินให้ถูกต้อง จากนั้นติ๊กยืนยันด้านล่างเพื่อจบการทำรายการ
                (ไม่จำเป็นต้องแนบสลิปหรือเลขอ้างอิง)
              </p>
              <label className="mt-2 flex items-center gap-2 text-[13px]">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                ข้าพเจ้ายืนยันว่าได้ชำระเงินตามวิธีที่เลือกเรียบร้อยแล้ว
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 pt-1">
          <button onClick={() => history.back()} className="px-5 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50">
            ย้อนกลับ
          </button>
          <button
            onClick={onConfirmPay}
            disabled={loading || !agree}
            className="px-6 py-2 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 disabled:opacity-60"
          >
            {loading ? "กำลังดำเนินการ..." : "ยืนยันชำระเงิน"}
          </button>
        </div>
      </div>
    </LayoutWrapper>
  );
}