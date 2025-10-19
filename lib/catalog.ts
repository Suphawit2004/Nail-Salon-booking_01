export type Service = { id:string; title:string; desc:string; price:number; promo?: boolean };
export const SERVICES: Record<string, Service> = {
  "svc-01": { id:"svc-01", title:"ถอดpvc และต่อเล็บ (โปร!)", desc:"โปรสุดคุ้ม ถอด pvc + ต่อเล็บ + ทาสีเจล", price:100, promo:true },
  "svc-02": { id:"svc-02", title:"ถอดpvc ทาสีเจล", desc:"ถอด pvc ทาสีเจล", price:80 },
  "svc-03": { id:"svc-03", title:"ทาสีเจล", desc:"ทาสีเจล ลื่นๆ กลิ่นฟิน", price:60 },
};
