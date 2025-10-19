import { NextResponse } from "next/server";
import { findBooking, updateBooking } from "@/lib/store";
export async function GET(_:Request,{params}:{params:{id:string}}){ const bk=findBooking(params.id); if(!bk) return NextResponse.json({message:"not found"},{status:404}); return NextResponse.json(bk); }
export async function PATCH(req:Request,{params}:{params:{id:string}}){ const patch=await req.json(); const bk=updateBooking(params.id,patch); if(!bk) return NextResponse.json({message:"not found"},{status:404}); return NextResponse.json(bk); }
