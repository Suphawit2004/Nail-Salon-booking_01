import { NextResponse } from "next/server";
import { readBookings, HOLD_MIN } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId"); // optional; reserved for future capacity logic
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });
  const list = await readBookings();
  const takenSet = new Set<string>();
  const now = Date.now();
  for(const b of list){
    if(b.date !== date) continue;
    if(b.status === "PAID" || b.status === "DONE"){ takenSet.add(b.time); continue; }
    if(b.status === "PENDING"){
      const t = Date.parse(b.createdAt || "");
      if(!isNaN(t) && (now - t) <= HOLD_MIN*60*1000){ takenSet.add(b.time); }
    }
  }
  const taken = Array.from(takenSet);
  return NextResponse.json({ date, taken });
}
