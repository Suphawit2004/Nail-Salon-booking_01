
# Min Nail Studio — Next.js + Tailwind (App Router)

- มี Header + BottomNav เหมือนกันทุกหน้า (ผ่าน `app/(site)/layout.tsx` + `LayoutWrapper`)
- ตั้งค่า Tailwind + PostCSS พร้อมใช้งาน
- API `/api/bookings` เก็บข้อมูลในไฟล์ `var/bookings.json`
- หน้ารีวิวมีหัว/ท้ายครบ (ใช้ layout กลุ่มเดียวกัน)

## ติดตั้ง
```bash
npm i
npm run dev
```

> PowerShell: ลบโฟลเดอร์ .next ด้วย `npm run clean` (ใช้ rimraf แทน `rm -rf`)

## โครงสร้างย่อ
```
app/
  (site)/
    layout.tsx
    page.tsx
    booking/page.tsx
    reviews/page.tsx
    all-bookings/page.tsx
  components/
    LayoutWrapper.tsx
    BottomNav.tsx
  api/bookings/route.ts
lib/store.ts
public/* (รูป placeholder)
```
