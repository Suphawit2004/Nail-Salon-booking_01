import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const SLIP_DIR = path.join(process.cwd(), "var", "slips");

export async function GET(_: Request, { params }: { params: { name: string } }) {
  const file = path.join(SLIP_DIR, params.name);
  try {
    const data = await fs.readFile(file);
    // naive type detection
    const ext = params.name.split(".").pop()?.toLowerCase();
    const type = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : "application/octet-stream";
    return new Response(data, { headers: { "content-type": type } });
  } catch {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }
}