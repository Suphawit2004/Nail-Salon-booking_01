
import Link from "next/link";
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
              <div className="h-24 w-24 rounded-2xl bg-pink-50 ring-1 ring-pink-100"/>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{s.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
              </div>
              <Link href={`/reserve/day?serviceId=${s.id}`} className="px-3 py-1.5 rounded-lg text-xs bg-pink-500 text-white">จอง</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
