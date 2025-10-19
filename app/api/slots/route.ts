import { NextResponse } from "next/server";
import { readBookings } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId"); // optional; reserved for future capacity logic
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });
  const list = await readBookings();
  const taken = list
    .filter(b => b.date === date && (b.status === "PAID" || b.status === "DONE"))
    .map(b => b.time);
  return NextResponse.json({ date, taken });
}
