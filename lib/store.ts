import { promises as fs } from "fs";
import path from "path";

export type Booking = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  date: string;
  time: string;
  status: "PENDING"|"PAID"|"DONE"|"CANCELLED";
  createdAt: string;
  name?: string;
  phone?: string;
  paymentMethod?: string;
  paidAt?: string;
  code?: string;
  slipUrl?: string;
};

const filePath = path.join(process.cwd(), "var", "bookings.json");

async function ensure(){
  try{ await fs.access(filePath); }
  catch{
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

export async function readBookings(): Promise<Booking[]>{
  await ensure();
  const raw = await fs.readFile(filePath, "utf8");
  try{ return JSON.parse(raw) as Booking[]; } catch { return []; }
}

export async function writeBooking(b: Booking){
  const list = await readBookings();
  list.push(b);
  await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf8");
}

export async function findBooking(id: string){
  const list = await readBookings();
  return list.find(b => b.id === id);
}

export async function updateBooking(id: string, patch: Partial<Booking>){
  const list = await readBookings();
  const idx = list.findIndex(b => b.id === id);
  if(idx === -1) return null;
  const updated: Booking = { ...list[idx], ...patch };
  list[idx] = updated;
  await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf8");
  return updated;
}


export const HOLD_MIN = 15; // ถือคิวสถานะ PENDING ภายใน 15 นาที

function isPendingActive(b: Booking){
  if(b.status !== "PENDING") return false;
  const t = Date.parse(b.createdAt || "");
  if(isNaN(t)) return true; // ถ้าอ่านเวลาไม่ได้ ป้องกันการชนด้วยการถือว่า active
  return (Date.now() - t) <= HOLD_MIN * 60 * 1000;
}

export function isSlotLocked(list: Booking[], date: string, time: string){
  return list.some(b => b.date===date && b.time===time && (b.status==="PAID" || b.status==="DONE" || isPendingActive(b)));
}

