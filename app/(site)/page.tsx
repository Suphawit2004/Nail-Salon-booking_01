
import Image from "next/image";
export default function HomePage(){
  return (
    <div>
      <section className="px-4 mt-6">
        <div className="card p-5 app-banner">
          <div className="flex gap-4 items-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-pink-100 bg-white">
              <Image src="/work1.jpg" alt="work" fill className="object-cover"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-pink-700 leading-tight">Min<br/>Nail Salon</h1>
              <p className="text-xs text-gray-600 mt-1">รับทำเล็บทุกรูปแบบ • พิกัด : คดหกลุม / ตลาดวันมาร์เก็ต หน้า ม.พะเยา</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 mt-6">
        <div className="card p-5">
          <h2 className="text-center font-semibold mb-3">ผลงาน</h2>
          <div className="grid grid-cols-3 gap-3">
            {["/work1.jpg","/work2.jpg","/work3.jpg"].map((src,i)=>(
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-pink-100">
                <Image src={src} fill alt={"work-"+(i+1)} className="object-cover"/>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 mt-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="card overflow-hidden">
            <div className="relative h-28 w-full"><Image src="/idea1.jpg" alt="idea1" fill className="object-cover"/></div>
            <div className="p-4"><h3 className="font-semibold">มัดรวม 50+ ไอเดียเล็บฮาโลวีน</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-3">รวมลายเล็บฮาโลวีนสุดเก๋ เอาใจสายทำเล็บ ฯลฯ</p></div>
          </article>
          <article className="card overflow-hidden">
            <div className="relative h-28 w-full"><Image src="/idea2.jpg" alt="idea2" fill className="object-cover"/></div>
            <div className="p-4"><h3 className="font-semibold">ไอเดียทาเล็บ คริสต์มาส 2024</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-3">รวมไอเดียลายเล็บธีมคริสต์มาส สุดคิ้วท์ ทำรับเทศกาล</p></div>
          </article>
        </div>
      </section>
    </div>
  
      <section className="px-4 mt-6">
        <div className="card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-pink-600 font-semibold">โปรโมชันพิเศษ</p>
              <p className="text-sm text-gray-700 mt-1">ถอดpvc + ต่อเล็บ + ทาสีเจล — ราคาโปร</p>
            </div>
            <a href="/reserve/select?serviceId=svc-01" className="px-4 py-2 rounded-xl bg-pink-500 text-white text-sm">จองโปรโมชัน</a>
          </div>
        </div>
      </section>
  );
}

      
    