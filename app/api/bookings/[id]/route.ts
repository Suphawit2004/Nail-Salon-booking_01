import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "var", "bookings.json");
async function readAll(){ try{ const s=await fs.readFile(filePath,"utf8"); return JSON.parse(s||"[]"); }catch{ return []; } }
async function writeAll(list:any){ await fs.mkdir(path.dirname(filePath),{recursive:true}); await fs.writeFile(filePath, JSON.stringify(list,null,2), "utf8"); }

export async function GET(_req:Request, { params }:{params:{id:string}}){
  const list = await readAll();
  const item = list.find((x:any)=>x.id===params.id);
  if(!item) return NextResponse.json({error:"not-found"}, {status:404});
  return NextResponse.json(item);
}

export async function PATCH(req:Request, { params }:{params:{id:string}}){
  const body = await req.json();
  const list = await readAll();
  const idx = list.findIndex((x:any)=>x.id===params.id);
  if(idx<0) return NextResponse.json({error:"not-found"}, {status:404});
  list[idx] = { ...list[idx], ...body };
  await writeAll(list);
  return NextResponse.json(list[idx]);
}
