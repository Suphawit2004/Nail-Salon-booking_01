export type BookingStatus = "PENDING" | "PAID" | "DONE" | "CANCELLED";

export type Booking = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:mm (30 นาที)
  name?: string;
  phone?: string;
  status: BookingStatus;
  createdAt: string; // ISO
  price?: number;
};

const bookings: Booking[] = [];

export const SERVICES: Record<string, { title: string; detail: string; price: number }> = {
  "svc-01": { title: "ถอดPVC และต่อเล็บ", detail: "ถอด pvc ต่อเล็บ ทาสีเจล สีสุภาพ เน้นฟิลลิ่ง", price: 800 },
  "svc-02": { title: "ถอดPVC ทาสีเจล",   detail: "ถอด pvc, ไฟล์เล็บ, ทาสีเจล",               price: 600 },
  "svc-03": { title: "ทาสีเจล",           detail: "ทาสีเจล สีสุภาพ / สีพื้น",                   price: 500 },
};

export function readBookings(filter?: Partial<Pick<Booking, "serviceId" | "date" | "status">>) {
  if (!filter) return bookings.slice();
  return bookings.filter(b =>
    (filter.serviceId ? b.serviceId === filter.serviceId : true) &&
    (filter.date ? b.date === filter.date : true) &&
    (filter.status ? b.status === filter.status : true)
  );
}

export function writeBooking(b: Booking) {
  bookings.push(b);
  return b;
}

export function updateBooking(id: string, patch: Partial<Booking>) {
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], ...patch };
  return bookings[idx];
}

export function findBooking(id: string) {
  return bookings.find(b => b.id === id) || null;
}

/** กันการจองชนกัน: ถ้ามี PENDING/PAID/DONE ในเวลานั้นแล้ว ห้ามซ้ำ */
export function isSlotTaken(serviceId: string, date: string, time: string) {
  return bookings.some(b =>
    b.serviceId === serviceId &&
    b.date === date &&
    b.time === time &&
    b.status !== "CANCELLED"
  );
}
