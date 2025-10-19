"use client";
import useSWR from "swr";
import { useState } from "react";

type Review = { id:string; rating:number; comment:string; name?:string; createdAt:string };
const fetcher = (u:string)=>fetch(u).then(r=>r.json());

function Star({filled}:{filled:boolean}){
  return <svg viewBox="0 0 24 24" className={`h-5 w-5 ${filled?'fill-pink-500':'fill-pink-200'}`}>
    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.897l-7.336 3.869 1.402-8.168L.132 9.211l8.2-1.193z"/>
  </svg>;
}

export default function ReviewsPage(){
  const {data, mutate} = useSWR<Review[]>("/api/reviews", fetcher, {refreshInterval:10000});
  const [rating,setRating] = useState(5);
  const [hover,setHover] = useState<number|null>(null);
  const [name,setName] = useState(""); 
  const [comment,setComment] = useState(""); 
  const [loading,setLoading] = useState(false);

  const submit = async()=>{
    if(!comment.trim()) return alert("พิมพ์ความคิดเห็นก่อนนะคะ");
    setLoading(true);
    try{
      const r = await fetch("/api/reviews", {method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({rating, comment, name: name||undefined})});
      if(!r.ok){ alert("ส่งรีวิวไม่สำเร็จ"); setLoading(false); return; }
      setComment(""); setName(""); setRating(5); setHover(null);
      mutate();
    }finally{ setLoading(false); }
  };

  const list = data ?? [];

  return (
    <section className="px-4 mt-6 pb-24">
      <h2 className="text-pink-600 font-semibold mb-3">รีวิวลูกค้า</h2>

      <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4 shadow-soft mb-6">
        <div className="text-sm font-medium">ให้คะแนน</div>
        <div className="flex gap-1 mt-1">
          {[1,2,3,4,5].map(i=>{
            const f = (hover ?? rating) >= i;
            return <button key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} onClick={()=>setRating(i)} aria-label={`ให้ ${i} ดาว`}>
              <Star filled={f}/>
            </button>;
          })}
        </div>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="ชื่อ (ไม่บังคับ)" className="w-full rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm"/>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="คอมเมนต์ของคุณ" rows={3} className="w-full rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm"/>
        </div>
        <div className="mt-3 text-right">
          <button onClick={submit} disabled={loading} className="px-4 py-2 rounded-xl bg-pink-500 text-white text-sm disabled:opacity-50">{loading?"กำลังส่ง…":"ส่งรีวิว"}</button>
        </div>
      </div>

      <div className="space-y-3">
        {list.map(rv=> (
          <article key={rv.id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="flex gap-0.5 mt-0.5">{[1,2,3,4,5].map(i=><Star key={i} filled={i<=rv.rating}/>)}</div>
              <div className="flex-1">
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{rv.comment}</div>
                <div className="text-xs text-gray-500 mt-1">{rv.name||"ไม่ระบุชื่อ"} • {new Date(rv.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </article>
        ))}
        {list.length===0 && <div className="text-center text-sm text-gray-500 py-16">--- ยังไม่มีรีวิว ---</div>}
      </div>
    </section>
  );
}
