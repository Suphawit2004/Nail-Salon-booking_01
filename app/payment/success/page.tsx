import LayoutWrapper from "@/app/components/LayoutWrapper";
export default function PaySuccess(){
  return (
    <LayoutWrapper>
      <section className="px-4 mt-14 flex justify-center">
        <div className="rounded-3xl bg-white border border-pink-100 shadow p-10 text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-pink-50 flex items-center justify-center ring-1 ring-pink-200"><span className="text-3xl">✔</span></div>
          <h2 className="font-semibold text-gray-800">ชำระเงินสำเร็จ</h2><p className="text-gray-500 text-sm mt-1">ขอบคุณค่ะ เจอกันวันนัดนะคะ</p>
        </div>
      </section>
    </LayoutWrapper>
  );
}
