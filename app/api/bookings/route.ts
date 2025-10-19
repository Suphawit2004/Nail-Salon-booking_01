import { SERVICES } from "@/lib/catalog";

import { NextResponse } from "next/server";
import { readBookings, writeBooking, type Booking, isSlotLocked } from "@/lib/store";
const TZ = "+07:00";
const isPast = (date:string,time:string)=> new Date(`${date}T${time}:00${TZ}`).getTime() < Date.now();
export async function GET(req: Request){
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const list = await readBookings();
  const filtered = status ? list.filter(b => b.status === status) : list;
  return NextResponse.json(filtered.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)));
}
function genCode(){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "MN";
  for(let i=0;i<6;i++){ s += chars[Math.floor(Math.random()*chars.length)]; }
  return s;
}
export async function POST(req:Request){
  try{
    const { serviceId, date, time, name, phone } = await req.json();
    const serviceTitle = SERVICES[serviceId]?.title ?? "";
    if(!serviceId||!date||!time) return NextResponse.json({error:"bad-request"},{status:400});
    if(isPast(date,time)) return NextResponse.json({error:"past-not-allowed"},{status:400});
    const list = await readBookings();
    if(isSlotLocked(list, date, time)) return NextResponse.json({error:"slot-taken"},{status:409});
    const bk:Booking={id:`bk_${Date.now()}`,serviceId,serviceTitle,date,time,status:"PENDING",createdAt:new Date().toISOString(), name, phone, code: genCode() };
    await writeBooking(bk);
    return NextResponse.json(bk);
  }catch{ return NextResponse.json({error:"internal"},{status:500}); }
}
