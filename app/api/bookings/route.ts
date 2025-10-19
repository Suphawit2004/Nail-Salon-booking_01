import { SERVICES } from "@/lib/catalog";

import { NextResponse } from "next/server";
import { readBookings, writeBooking, type Booking } from "@/lib/store";
const TZ = "+07:00";
const isPast = (date:string,time:string)=> new Date(`${date}T${time}:00${TZ}`).getTime() < Date.now();
export async function GET(){ const list=await readBookings(); return NextResponse.json(list.sort((a,b)=>b.createdAt.localeCompare(a.createdAt))); }
export async function POST(req:Request){
  try{
    const { serviceId, date, time } = await req.json();
    const serviceTitle = SERVICES[serviceId]?.title ?? "";
    if(!serviceId||!date||!time) return NextResponse.json({error:"bad-request"},{status:400});
    if(isPast(date,time)) return NextResponse.json({error:"past-not-allowed"},{status:400});
    const bk:Booking={id:`bk_${Date.now()}`,serviceId,serviceTitle,date,time,status:"PENDING",createdAt:new Date().toISOString()};
    await writeBooking(bk);
    return NextResponse.json(bk);
  }catch{ return NextResponse.json({error:"internal"},{status:500}); }
}
