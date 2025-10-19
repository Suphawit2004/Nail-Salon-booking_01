export type Service = { id:string; title:string; desc:string; price:number; promo?: boolean; img?: string };
export const SERVICES: Record<string, Service> = {
  "svc-01": { id:"svc-01", title:"ถอดpvc และต่อเล็บ", desc:"โปรสุดคุ้ม ถอด pvc + ต่อเล็บ + ทาสีเจล", price:100 , img:"/services/svc-01.jpg"},
  "svc-02": { id:"svc-02", title:"ถอดpvc ทาสีเจล", desc:"ถอด pvc ทาสีเจล", price:80 , img:"/services/svc-02.jpg"},
  "svc-03": { id:"svc-03", title:"ทาสีเจล", desc:"ทาสีเจล ลื่นๆ กลิ่นฟิน", price:60 , img:"/services/svc-03.jpg"},
};
