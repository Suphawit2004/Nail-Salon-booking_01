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
