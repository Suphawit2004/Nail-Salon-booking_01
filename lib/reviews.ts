import { promises as fs } from "fs";
import path from "path";

export type Review = {
  id: string;
  rating: number; // 1..5
  comment: string;
  name?: string;
  bookingId?: string;
  createdAt: string;
};

const filePath = path.join(process.cwd(), "var", "reviews.json");

async function ensure(){
  try{ await fs.access(filePath); }
  catch{
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

export async function readReviews(): Promise<Review[]>{ 
  await ensure();
  const raw = await fs.readFile(filePath, "utf8");
  try { return JSON.parse(raw) as Review[]; } catch { return []; }
}

export async function writeReview(r: Review){
  const list = await readReviews();
  list.push(r);
  await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf8");
}
