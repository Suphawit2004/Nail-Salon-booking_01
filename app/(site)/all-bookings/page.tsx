
"use client";
import useSWR from "swr";
const fetcher = (u:string)=>fetch(u).then(r=>r.json());
type Booking={id:string,serviceTitle:string,date:string,time:string,status:"PENDING"|"PAID"|"DONE"|"CANCELLED",createdAt:string};
export default function AllBookingsPage(){
  const {data} = useSWR<Booking[]>("/api/bookings", fetcher, {refreshInterval:5000});
  return (
    <section className="px-4 mt-6 pb-24">
      <h2 className="text-pink-600 font-semibold mb-3">จองทั้งหมด (อัปเดตอัตโนมัติ)</h2>
      <div className="space-y-3">
        {(data??[]).map(b=>(
          <article key={b.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div><p className="font-semibold">{b.serviceTitle}</p><p className="text-sm text-gray-600">{b.date} • {b.time}</p></div>
              <span className="text-xs rounded-full px-2.5 py-1 bg-pink-100 text-pink-700">{b.status}</span>
            </div>
          </article>
        ))}
        {!data?.length && <p className="text-sm text-gray-500">--- ไม่พบรายการ ---</p>}
      </div>
    </section>
  )
}
