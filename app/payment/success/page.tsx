"use client";
import BackBar from "@/app/components/BackBar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaySuccess(){
  const router = useRouter();
  useEffect(()=>{ const t=setTimeout(()=>router.replace("/all-bookings"), 1200); return ()=>clearTimeout(t); },[router]);
  return (
    <>
      <BackBar title="ชำระเงินสำเร็จ" href="/all-bookings" />
      <section className="px-4 mt-10 text-center">
        <div className="inline-block rounded-2xl border border-pink-100 bg-white px-8 py-10 shadow-soft">
          <div className="mx-auto mb-3 h-16 w-16 rounded-full grid place-items-center border border-emerald-200 bg-emerald-50 text-emerald-600">✓</div>
          <p className="font-semibold">ชำระเงินสำเร็จ</p>
        </div>
      </section>
    </>
  );
}
