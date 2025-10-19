"use client";
import { useRouter } from "next/navigation";

export default function BackBar({ title, href }: { title?: string; href?: string }){
  const router = useRouter();
  const go = () => href ? router.push(href) : router.back();
  return (
    <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-pink-100">
      <div className="px-4 py-3 flex items-center gap-3">
        <button onClick={go} aria-label="ย้อนกลับ"
          className="h-9 w-9 grid place-items-center rounded-full border border-pink-200 text-pink-600">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        {title ? <span className="text-sm font-medium">{title}</span> : null}
      </div>
    </div>
  );
}
