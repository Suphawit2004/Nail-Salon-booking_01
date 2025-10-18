import Image from "next/image";
import LayoutWrapper from "./components/LayoutWrapper";
export default function HomePage(){
  return (
    <LayoutWrapper>
      <section className="mt-4 rounded-[26px] bg-pink-50 ring-1 ring-pink-100 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-[88px] h-[88px] rounded-2xl overflow-hidden ring-1 ring-pink-100 bg-white">
            <Image src="/banner.jpg" alt="banner" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-rose-700 leading-tight">Min<br/>Nail Salon</h2>
            <p className="text-xs text-gray-600 mt-1">รับทำเล็บทุกรูปแบบ • พิกัด : คตกหลุม / ตลาดวันมาร์เก็ต หน้า ม.พะเยา</p>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
