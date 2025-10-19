import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "var", "bookings.json");
async function readAll(){ try{ const s=await fs.readFile(filePath,"utf8"); return JSON.parse(s||"[]"); }catch{ return []; } }
async function writeAll(list:any){ await fs.mkdir(path.dirname(filePath),{recursive:true}); await fs.writeFile(filePath, JSON.stringify(list,null,2), "utf8"); }

export async function GET(){ const list = await readAll(); return NextResponse.json(list); }

export async function POST(req:Request){
  const body = await req.json();
  const list = await readAll();
  const id = "bk_" + Math.random().toString(36).slice(2,10);
  const now = new Date().toISOString();
  const item = { id, status:"PENDING", createdAt: now, ...body };
  list.push(item);
  await writeAll(list);
  return NextResponse.json(item, { status:201 });
}
