import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { readAll, writeAll } from "@/app/api/_utils/store";

const publicSlips = path.join(process.cwd(), "public", "slips");

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { imageBase64 } = await req.json();
  if (!imageBase64) return NextResponse.json({ error: "missing imageBase64" }, { status: 400 });

  const m = imageBase64.match(/^data:(image\/\\w+);base64,(.+)$/);
  if (!m) return NextResponse.json({ error: "invalid base64" }, { status: 400 });

  const mime = m[1]; const data = m[2];
  const ext = mime.split("/")[1];
  const buf = Buffer.from(data, "base64");

  const filename = `${params.id}-${Date.now()}.${ext}`;
  await fs.mkdir(publicSlips, { recursive: true });
  await fs.writeFile(path.join(publicSlips, filename), buf);

  const list = await readAll();
  const idx = list.findIndex((x:any)=>x.id===params.id);
  if(idx<0) return NextResponse.json({ error:"not-found" }, { status:404 });
  list[idx].slipUrl = `/slips/${filename}`;
  await writeAll(list);

  return NextResponse.json({ slipUrl: list[idx].slipUrl }, { status: 201 });
}
