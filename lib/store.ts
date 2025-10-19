
import { promises as fs } from "fs";
import path from "path";
export type Booking={id:string,serviceId:string,serviceTitle:string,date:string,time:string,status:"PENDING"|"DONE"|"CANCELLED",createdAt:string};
const filePath = path.join(process.cwd(),"var","bookings.json");
async function ensure(){try{await fs.access(filePath)}catch{await fs.mkdir(path.dirname(filePath),{recursive:true});await fs.writeFile(filePath,"[]","utf8")}}
export async function readBookings():Promise<Booking[]>{await ensure();const raw=await fs.readFile(filePath,"utf8");try{return JSON.parse(raw)}catch{return []}}
export async function writeBooking(b:Booking){const list=await readBookings();list.unshift(b);await fs.writeFile(filePath,JSON.stringify(list,null,2),"utf8")}
