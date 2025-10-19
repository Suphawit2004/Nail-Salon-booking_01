import { NextResponse } from "next/server";
import { findBooking, updateBooking } from "@/lib/store";
import { promises as fs } from "fs";
import path from "path";

const SLIP_DIR = path.join(process.cwd(), "var", "slips");

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const bk = await findBooking(params.id);
  if (!bk) return NextResponse.json({ message: "not found" }, { status: 404 });
  return NextResponse.json(bk);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const ct = req.headers.get("content-type") || "";
  const bk = await findBooking(params.id);
  if (!bk) return NextResponse.json({ message: "not found" }, { status: 404 });

  try {
    // Multipart => slip upload + paymentMethod
    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      const methodRaw = String(form.get("paymentMethod") || "").toUpperCase();
      const paymentMethod = methodRaw === "BANK" ? "BANK" : "PROMPTPAY"; // restrict to BANK/PROMPTPAY

      const file = form.get("slip") as unknown as File | null;
      let slipUrl: string | undefined = undefined;

      if (file && typeof file === "object") {
        await fs.mkdir(SLIP_DIR, { recursive: true });
        const buf = Buffer.from(await file.arrayBuffer());
        const ext = (file.type?.split("/")[1] || "bin").toLowerCase();
        const filename = `${params.id}-${Date.now()}.${ext}`;
        const full = path.join(SLIP_DIR, filename);
        await fs.writeFile(full, buf);
        // We'll serve via a simple file handler later, but keep relative path now
        slipUrl = `/api/slips/${filename}`;
      }

      const updated = await updateBooking(params.id, {
        paymentMethod,
        paidAt: new Date().toISOString(),
        status: "PAID",
        ...(slipUrl ? { slipUrl } : {}),
      });

      return NextResponse.json(updated);
    }

    // JSON => generic updates (status etc.)
    const body = await req.json().catch(() => ({}));
    // Hard restrict paymentMethod if present
    if (body.paymentMethod && !["BANK", "PROMPTPAY"].includes(String(body.paymentMethod).toUpperCase())) {
      return NextResponse.json({ message: "invalid payment method" }, { status: 400 });
    }
    const patch: any = { ...body };
    const updated = await updateBooking(params.id, patch);
    if (!updated) return NextResponse.json({ message: "not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e:any) {
    return NextResponse.json({ message: "error", detail: e?.message }, { status: 500 });
  }
}