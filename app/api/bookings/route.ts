import { NextResponse } from "next/server";
import { readBookings, writeBookings, Booking } from "../../lib/store";

const TZ_OFFSET = "+07:00";
function isPast(date: string, time: string) {
  if (!date || !time) return true;
  const when = new Date(`${date}T${time}:00${TZ_OFFSET}`);
  return isNaN(when.getTime()) || when.getTime() < Date.now();
}

export async function GET() {
  const list = await readBookings();
  list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { serviceId, serviceTitle, date, time, promo } = body || {};
    if (!serviceId || !serviceTitle || !date || !time) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    if (isPast(date, time)) {
      return NextResponse.json({ error: "ไม่สามารถจองย้อนหลังได้" }, { status: 400 });
    }

    // อ่านรายการปัจจุบันมาก่อน แล้วค่อยตรวจชนกัน
    const list = await readBookings();
    if (list.some(b => b.date === date && b.time === time && b.status !== "CANCELLED")) {
      return NextResponse.json({ error: "ช่วงเวลานี้ถูกจองแล้ว" }, { status: 409 });
    }

    const booking: Booking = {
      id: `bk_${Date.now()}`,
      serviceId,
      serviceTitle,
      date,
      time,
      createdAt: new Date().toISOString(),
      status: "PENDING",
      promo: promo && typeof promo === "object"
        ? {
            title: promo.title,
            price: typeof promo.price === "number" ? promo.price : undefined,
            oldPrice: typeof promo.oldPrice === "number" ? promo.oldPrice : undefined,
          }
        : undefined,
    };

    list.unshift(booking);
    await writeBookings(list);
    return NextResponse.json(booking, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "internal error", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await writeBookings([]);
  return NextResponse.json({ ok: true });
}
