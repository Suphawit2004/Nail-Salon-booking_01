"use client";
import Image from "next/image";
import Link from "next/link";
import LayoutWrapper from "../components/LayoutWrapper";

type Service = { id:string; title:string; desc:string[]; img?:string };
const services: Service[] = [
  { id:"svc-01", title:"ถอดPVC และต่อเล็บ", desc:["รายละเอียด","ถอด pvc ต่อเล็บ ทาสีเจล สีคุม แน่นสวย","อัปเกรดลายได้"], img:"/nail-blank.png" },
  { id:"svc-02", title:"ถอดpvc ทาสีเจล", desc:["รายละเอียด","ถอด pvc ทำความสะอาดโคนเล็บ","ทาสีเจล ครบทุกขั้นตอน"], img:"/nail-blank.png" },
  { id:"svc-03", title:"ทาสีเจล", desc:["รายละเอียด","ตะไบ ตัดหนัง ทาสีเจล","รับประกันสีตรง โทนสวย"], img:"/nail-blank.png" },
];
export default function BookingPage(){
  return (
    <LayoutWrapper>
      <h2 className="text-sm font-semibold text-pink-600 mt-4 mb-3">เลือกบริการ</h2>
      <ul className="space-y-4 pb-24">
        {services.map(s=>(
          <li key={s.id} className="rounded-[18px] bg-pink-50 ring-1 ring-pink-100 shadow-[0_10px_24px_rgba(255,182,193,.18)] p-4">
            <div className="flex gap-4">
              <div className="relative w-[105px] h-[105px] rounded-xl overflow-hidden bg-white ring-1 ring-pink-100 shrink-0">
                <Image src={s.img ?? '/nail-blank.png'} alt={s.title} fill className="object-cover"/>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">{s.title}</h3>
                <div className="mt-2 rounded-[14px] bg-white ring-1 ring-pink-100 p-2 text-[12px] leading-relaxed text-gray-700">
                  {s.desc.map((line,i)=>(<div key={i} className={i===0? "font-medium text-gray-600 mb-1":""}>{line}</div>))}
                </div>
                <div className="mt-2 flex justify-end">
                  <Link href={`/reserve?serviceId=${s.id}`} className="px-4 py-1.5 rounded-lg bg-pink-500 text-white text-xs font-medium hover:bg-pink-600">จอง</Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </LayoutWrapper>
  );
}
