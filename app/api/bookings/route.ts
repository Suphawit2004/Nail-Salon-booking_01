import { NextResponse } from "next/server";
import { readBookings, writeBookings, type Booking } from "../../lib/store";

const TZ = "+07:00";
const isPast = (date: string, time: string) =>
  new Date(`${date}T${time}:00${TZ}`).getTime() < Date.now();

export async function GET() {
  const list = await readBookings();
  return NextResponse.json(list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { serviceId, serviceTitle, date, time, customerName, phone } = body;
  if (!serviceId || !serviceTitle || !date || !time)
    return NextResponse.json({ error: "missing" }, { status: 400 });

  if (isPast(date, time))
    return NextResponse.json({ error: "เวลาย้อนหลัง" }, { status: 400 });

  const list = await readBookings();
  if (list.some((b) => b.date === date && b.time === time && b.status !== "CANCELLED"))
    return NextResponse.json({ error: "ช่วงเวลานี้ถูกจองแล้ว" }, { status: 409 });

  const id = `bk_${Date.now()}`;
  const bk: Booking = {
    id,
    serviceId,
    serviceTitle,
    date,
    time,
    customerName,
    phone,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  list.push(bk);
  await writeBookings(list);
  return NextResponse.json({ id });
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const list = await readBookings();
  const i = list.findIndex((b) => b.id === body.id);
  if (i < 0) return NextResponse.json({ error: "not found" }, { status: 404 });

  if (body.status) list[i].status = body.status;
  await writeBookings(list);
  return NextResponse.json({ ok: true });
}
