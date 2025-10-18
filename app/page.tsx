"use client";

import Image from "next/image";
import Link from "next/link";
import LayoutWrapper from "./components/LayoutWrapper";

function PromoCard({ img, title, desc, price, oldPrice, href, badge }:{ img:string; title:string; desc:string; price:number; oldPrice?:number; href:string; badge?:string; }){
  return (
    <article className="rounded-2xl overflow-hidden ring-1 ring-pink-100 bg-white shadow-[0_8px_20px_rgba(255,182,193,0.18)]">
      <div className="relative h-36 w-full">
        <img src={img} alt={title} className="h-full w-full object-cover"/>
        {badge && <span className="absolute left-3 top-3 rounded-full bg-rose-500 text-white text-[11px] px-2 py-1 shadow">{badge}</span>}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 leading-relaxed">{desc}</p>
        <div className="mt-3 flex items-end gap-2">
          {oldPrice && <span className="text-xs text-gray-400 line-through">฿{oldPrice.toLocaleString()}</span>}
          <span className="text-lg font-bold text-rose-600">฿{price.toLocaleString()}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">*เงื่อนไขโปรอาจเปลี่ยนแปลง</span>
          <a href={href} className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-pink-500 hover:bg-pink-600 shadow-sm">จองโปรนี้</a>
        </div>
      </div>
    </article>
  );
}

export default function HomePage(){
  return (
    <LayoutWrapper>
      <section className="mt-4">
        <div className="rounded-[28px] bg-pink-50 border border-pink-100 shadow-[0_6px_14px_rgba(255,182,193,0.25)] p-4 sm:p-6">
          <div className="grid grid-cols-[110px_1fr] gap-4 items-center">
            <div className="relative h-[110px] w-[110px] rounded-2xl bg-white ring-1 ring-pink-100 overflow-hidden">
              <Image src="/banner-nail.jpg" alt="banner" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-[28px] leading-8 font-bold text-rose-700 drop-shadow-sm">
                Min<br/><span className="text-[30px]">Nail Salon</span>
              </h1>
              <p className="mt-2 text-[13px] text-gray-600">
                รับทำเล็บทุกรูปแบบ • พิกัด : คตกหลุม / ตลาดวันมาร์เก็ต หน้า ม.พะเยา
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ผลงาน */}
      <section className="mt-6">
        <div className="rounded-[22px] bg-white border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 text-center">ผลงาน</h2>
          <div className="grid grid-cols-3 gap-3">
            {["/work1.jpg","/work2.jpg","/work3.jpg"].map((src,i)=>(
              <div key={i} className="aspect-square overflow-hidden rounded-2xl ring-1 ring-pink-100">
                <Image src={src} alt={`work-${i+1}`} width={300} height={300} className="h-full w-full object-cover"/>
              </div>
            ))}
          </div>
          <div className="text-right mt-2">
            <Link href="/gallery" className="text-xs text-pink-600 hover:underline">เพิ่มเติม</Link>
          </div>
        </div>
      </section>

      {/* โปรโมชั่น */}
      <section className="mt-6 pb-2">
        <div className="rounded-[22px] bg-white border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">โปรโมชั่น</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <PromoCard img="/promo1.jpg" title="โปร “ทาสีเจล + ล้างทำความสะอาด”" desc="เลือกสีได้ไม่จำกัดโทน ฟรี ตะไบ/ขัดผิวเล็บ และท็อปเจลเงา" oldPrice={590} price={459} href="/reserve?serviceId=svc-03&promo=gel-basic" badge="ถึงสิ้นเดือนนี้" />
            <PromoCard img="/promo2.jpg" title="โปร “ถอด PVC + ต่อเล็บ + ทาสีเจล”" desc="ทรงสวย งานละเอียด ฟรี เก็บทรง/ขัดผิวเล็บ" oldPrice={1090} price={890} href="/reserve?serviceId=svc-01&promo=pvc-plus-gel" badge="ฮิต!" />
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
