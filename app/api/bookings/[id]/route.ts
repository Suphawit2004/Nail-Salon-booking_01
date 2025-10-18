import { NextResponse } from "next/server";
import { readBookings, writeBookings } from "../../../lib/store";
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const list = await readBookings();
  const b = list.find(x => x.id === params.id);
  if (!b) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(b);
}
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const { status, paymentMethod, paymentRef, paidAt, customerName, phone, completedAt } = body || {};
  const list = await readBookings();
  const i = list.findIndex(b => b.id === params.id);
  if (i === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  const prev = list[i];
  list[i] = { ...prev, ...(status ? { status } : {}), ...(paymentMethod ? { paymentMethod } : {}), ...(paymentRef ? { paymentRef } : {}), ...(paidAt ? { paidAt } : {}), ...(customerName ? { customerName } : {}), ...(phone ? { phone } : {}), ...(completedAt !== undefined ? { completedAt } : {}), };
  await writeBookings(list);
  return NextResponse.json(list[i]);
}