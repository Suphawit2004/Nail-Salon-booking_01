// app/components/LayoutWrapper.tsx
"use client";
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return <div className="section">{children}</div>; // แค่เว้น padding/ความกว้าง
}
