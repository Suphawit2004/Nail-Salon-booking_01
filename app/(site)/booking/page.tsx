import Image from "next/image";

import Link from "next/link";
const DEPOSIT = 100;
const services=[
  {id:"svc-01",title:"ถอดpvc และต่อเล็บ",desc:"ถอด pvc ต่อเล็บ ทาสีเจล ลิ้มๆ เพิ่มฟิน",price:100},
  {id:"svc-02",title:"ถอดpvc ทาสีเจล",desc:"ถอด pvc ทาสีเจล",price:80},
  {id:"svc-03",title:"ทาสีเจล",desc:"ทาสีเจล ลื่นๆ กลิ่นฟิน",price:60},
];
export default function BookingPage(){
  return (
    <section className="px-4 mt-6">
      <h2 className="text-pink-600 font-semibold mb-3">เลือกบริการ</h2>
      <div className="space-y-4">
        {services.map(s=> (
          <article key={s.id} className="card p-4">
            <div className="flex gap-3 items-start">
              <div className="relative h-24 w-24 rounded-2xl ring-1 ring-pink-100 overflow-hidden"><Image src={`/svc-${s.id.split("-")[1]}.jpg`} alt={s.title} fill className="object-cover"/></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{s.title}</h3> <span className="ml-2 align-middle rounded-full bg-pink-100 text-pink-700 text-[11px] px-2 py-0.5 border border-pink-200">100฿</span>
                <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
              </div>
              <Link href={`/reserve?serviceId=${s.id}`} className="px-3 py-1.5 rounded-lg text-xs bg-pink-500 text-white">จอง</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
