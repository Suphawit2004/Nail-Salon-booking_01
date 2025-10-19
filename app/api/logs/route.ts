import { NextResponse } from "next/server";
import { readLogs, writeLog, type LogEntry } from "@/lib/log";

export async function GET(){
  const list = await readLogs();
  return NextResponse.json(list.slice().sort((a,b)=> b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: Request){
  try{
    const body = await req.json();
    const e: LogEntry = { id:`lg_${Date.now()}`, createdAt:new Date().toISOString(), ...body };
    await writeLog(e);
    return NextResponse.json(e, {status:201});
  }catch{
    return NextResponse.json({error:"internal"}, {status:500});
  }
}
