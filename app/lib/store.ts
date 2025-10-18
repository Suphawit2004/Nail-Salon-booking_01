import { promises as fs } from "fs";
import path from "path";

export type Booking = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  date: string;
  time: string;
  customerName?: string;
  phone?: string;
  status: "PENDING" | "PAID" | "DONE" | "CANCELLED";
  createdAt: string;
};

const file = path.join(process.cwd(), ".data", "bookings.json");

async function ensure() {
  try { await fs.stat(file); }
  catch {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, "[]", "utf-8");
  }
}

export async function readBookings(): Promise<Booking[]> {
  await ensure();
  const raw = await fs.readFile(file, "utf-8");
  try { return JSON.parse(raw) as Booking[]; } catch { return []; }
}

export async function writeBookings(d: Booking[]) {
  await ensure();
  await fs.writeFile(file, JSON.stringify(d, null, 2), "utf-8");
}
