import { promises as fs } from "fs";
import path from "path";

export type LogEntry = {
  id: string;
  type: "BOOKING_CREATE"|"BOOKING_UPDATE"|"REVIEW_CREATE"|"PAYMENT";
  bookingId?: string;
  fromStatus?: string;
  toStatus?: string;
  payload?: any;
  createdAt: string;
};

const filePath = path.join(process.cwd(), "var", "logs.json");

async function ensure(){
  try{ await fs.access(filePath); }
  catch{
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

export async function readLogs(): Promise<LogEntry[]>{ 
  await ensure();
  const raw = await fs.readFile(filePath, "utf8");
  try { return JSON.parse(raw) as LogEntry[]; } catch { return []; }
}

export async function writeLog(e: LogEntry){
  const list = await readLogs();
  list.push(e);
  await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf8");
}
