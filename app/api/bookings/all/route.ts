import { NextResponse } from "next/server";
import { readBookings } from "@/lib/store";

export async function GET(){
  const list = await readBookings();
  return NextResponse.json(list.slice().sort((a,b)=> b.createdAt.localeCompare(a.createdAt)));
}
