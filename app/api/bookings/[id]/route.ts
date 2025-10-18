import { NextResponse } from "next/server";
import { readBookings, writeBookings } from "../../../lib/store";

export async function GET(_req:Request,{ params }: { params:{ id:string } }){
  const list = await readBookings();
  const item = list.find(b=> b.id===params.id);
  if(!item) return NextResponse.json({ error:"not found" },{ status:404 });
  return NextResponse.json(item);
}

export async function PATCH(req:Request,{ params }:{ params:{ id:string } }){
  const body = await req.json().catch(()=>({}));
  const { status, paymentMethod, paymentRef, paidAt } = body as {
    status?: "PENDING" | "CONFIRMED" | "CANCELLED";
    paymentMethod?: string;
    paymentRef?: string;
    paidAt?: string;
  };
  if(!status && !paymentMethod && !paymentRef && !paidAt){
    return NextResponse.json({ error:"no update fields" },{ status:400 });
  }
  const list = await readBookings();
  const idx = list.findIndex(b=> b.id===params.id);
  if(idx===-1) return NextResponse.json({ error:"not found" },{ status:404 });
  list[idx] = {
    ...list[idx],
    ...(status ? { status } : {}),
    ...(paymentMethod ? { paymentMethod } : {}),
    ...(paymentRef ? { paymentRef } : {}),
    ...(paidAt ? { paidAt } : {}),
  };
  await writeBookings(list);
  return NextResponse.json(list[idx]);
}

export async function DELETE(_req:Request,{ params }:{ params:{ id:string } }){
  const list = await readBookings();
  const next = list.filter(b=> b.id!==params.id);
  if(next.length===list.length) return NextResponse.json({ error:"not found" },{ status:404 });
  await writeBookings(next);
  return NextResponse.json({ ok:true });
}
