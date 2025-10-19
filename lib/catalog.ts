export type Service = { id:string; title:string; desc:string; price:number };
export const SERVICES: Record<string, Service> = {
  "svc-01": { id:"svc-01", title:"ถอดpvc และต่อเล็บ", desc:"ถอด pvc ต่อเล็บ ทาสีเจล ลื่นๆ เพิ่มฟิน", price:100 },
  "svc-02": { id:"svc-02", title:"ถอดpvc ทาสีเจล", desc:"ถอด pvc ทาสีเจล", price:80 },
  "svc-03": { id:"svc-03", title:"ทาสีเจล", desc:"ทาสีเจล ลื่นๆ กลิ่นฟิน", price:60 },
};
