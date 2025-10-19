
import Image from "next/image";
import { Facebook, MapPin, Phone } from "lucide-react";


const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61554037857683";
const MAPS_URL = "https://maps.app.goo.gl/R3o4BL5yqs6FnZ7f8?g_st=ic";
const ADDRESS = "Phayao, Thailand, Phayao 56000";
const PHONE = ""; // TODO: ใส่เบอร์โทร เช่น "081-234-5678"

export default function HomePage(){
  return (
    <div>
      <section className="px-4 mt-6">
        <div className="card p-5">
          <div className="flex gap-4 items-center"><div>
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
            {["/work1.png","/work2.png","/work3.png"].map((src,i)=>(
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-pink-100">
                <Image src={src} fill alt={"work-"+(i+1)} className="object-cover"/>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 mt-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          </div>
      </section>

<section className="px-4 pt-2">
  <div className="card p-4">
    <h3 className="text-sm font-semibold text-pink-700 mb-2">ติดต่อเรา</h3>
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Facebook className="h-4 w-4" />
        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-pink-700 hover:underline">
          Facebook Page
        </a>
      </div>
      <div className="flex items-start gap-2">
        <MapPin className="h-4 w-4 mt-0.5" />
        <div>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-pink-700 hover:underline">
            เปิดในแผนที่ (Google Maps)
          </a>
          <div className="text-xs text-gray-600">{ADDRESS}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4" />
        {PHONE ? (
          <a href={`tel:${PHONE.replace(/\D/g,"")}`} className="font-medium">{PHONE}</a>
        ) : (
          <span className="text-gray-500">+95 81 90 899</span>
        )}
      </div>
    </div>
  </div>
</section>


    </div>
  );
}
