import { NextResponse } from "next/server";
import { readAll } from "@/app/api/_utils/store";
import { SERVICES } from "@/lib/catalog";
import { toMin, overlap, STEP, DAY_START, DAY_END, toTime } from "@/app/api/_utils/time";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId") || "";
  if (!date) return NextResponse.json({ error: "missing date" }, { status: 400 });

  const newDur = (SERVICES[serviceId]?.duration ?? 60);
  const list = await readAll();
  const busyList = list.filter(x => x.date === date && x.status !== "CANCELLED");

  const busyTimes: string[] = [];
  for (let t = DAY_START; t <= DAY_END - newDur; t += STEP) {
    const clash = busyList.some(x => {
      const s2 = toMin(x.time);
      const d2 = (SERVICES[x.serviceId]?.duration ?? 60);
      return overlap(t, newDur, s2, d2);
    });
    if (clash) busyTimes.push(toTime(t));
  }

  return NextResponse.json({ busy: busyTimes });
}
