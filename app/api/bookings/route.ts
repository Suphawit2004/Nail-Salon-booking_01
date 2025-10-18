import { NextResponse } from "next/server";
import { readBookings, writeBookings, type Booking } from "../../lib/store";

export async function GET(){
  const list = await readBookings();
  list.sort((a,b)=> a.createdAt < b.createdAt ? 1 : -1);
  return NextResponse.json(list, { status: 200 });
}

export async function POST(req:Request){
  try{
    const body = await req.json().catch(()=> ({}));
    const { serviceId, serviceTitle, date, time } = body ?? {};
    if(!serviceId || !serviceTitle || !date || !time){
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    const booking: Booking = {
      id: `bk_${Date.now()}`,
      serviceId, serviceTitle, date, time,
      createdAt: new Date().toISOString(),
      status: "PENDING"
    };
    const list = await readBookings();
    list.unshift(booking);
    await writeBookings(list);
    return NextResponse.json(booking, { status: 201 });
  } catch(e:any){
    console.error("POST /api/bookings error:", e);
    return NextResponse.json({ error:"internal error", detail:String(e?.message || e) }, { status: 500 });
  }
}

export async function DELETE(){
  await writeBookings([]);
  return NextResponse.json({ ok: true }, { status: 200 });
}
