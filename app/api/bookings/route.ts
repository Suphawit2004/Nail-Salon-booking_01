import { writeLog } from "@/lib/log";
import { NextResponse } from "next/server";
import { readBookings, writeBooking, type Booking } from "@/lib/store";
import { SERVICES } from "@/lib/catalog";

export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // optional: PENDING|PAID|DONE|CANCELLED|ALL
  const list = await readBookings();
  let data = list;
  if(status && status !== "ALL"){
    data = list.filter(b => b.status === status);
  }
  // newest first
  data = data.slice().sort((a,b)=> b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(data);
}

export async function POST(req: Request){
  try{
    const body = await req.json();
    const serviceId = String(body?.serviceId||"");
    const date = String(body?.date||"");
    const time = String(body?.time||"");
    if(!serviceId || !date || !time){
      return NextResponse.json({error:"serviceId, date, time required"}, {status:400});
    }
    const title = (body?.serviceTitle ?? SERVICES[serviceId]?.title ?? "ไม่ระบุบริการ") as string;
    const bk: Booking = {
      id: `bk_${Date.now()}`,
      serviceId,
      serviceTitle: title,
      date,
      time,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      name: body?.name,
      phone: body?.phone,
    };
    await writeBooking(bk);
    await writeLog({id:`lg_${Date.now()}`, type:"BOOKING_CREATE", bookingId: bk.id, payload: bk, createdAt: new Date().toISOString()});
    return NextResponse.json(bk, {status:201});
  }catch{
    return NextResponse.json({error:"internal"}, {status:500});
  }
}
