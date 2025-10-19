import { NextResponse } from "next/server";
import { readAll, writeAll } from "@/app/api/_utils/store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const list = await readAll();
  const item = list.find(x=>x.id===params.id);
  if(!item) return NextResponse.json({ error:"not-found" }, { status:404 });
  return NextResponse.json(item);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const list = await readAll();
  const idx = list.findIndex(x=>x.id===params.id);
  if(idx<0) return NextResponse.json({ error:"not-found" }, { status:404 });
  list[idx] = { ...list[idx], ...body };
  await writeAll(list);
  return NextResponse.json(list[idx]);
}
