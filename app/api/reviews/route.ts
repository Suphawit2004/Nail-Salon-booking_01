import { NextResponse } from "next/server";
import { readReviews, writeReview, type Review } from "@/lib/reviews";

export async function GET(){
  const list = await readReviews();
  return NextResponse.json(list.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: Request){
  try{
    const body = await req.json();
    const rating = Number(body?.rating ?? 0);
    const comment = String(body?.comment ?? "").trim();
    const name = body?.name ? String(body.name).trim() : undefined;
    const bookingId = body?.bookingId ? String(body.bookingId) : undefined;
    if(!(rating>=1 && rating<=5) || !comment) return NextResponse.json({error:"bad-request"}, {status:400});
    const r: Review = { id:`rv_${Date.now()}`, rating, comment, name, bookingId, createdAt:new Date().toISOString() };
    await writeReview(r);
    return NextResponse.json(r);
  }catch{
    return NextResponse.json({error:"internal"}, {status:500});
  }
}
