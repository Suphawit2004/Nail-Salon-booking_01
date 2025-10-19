export default function HomePage() {
  return (
    <>
      <section className="px-4 mt-6 pb-4">
        <div className="card p-4">
          <h2 className="text-pink-600 font-semibold">มีนเล็บสวย</h2>
          <p className="text-sm text-gray-700 mt-1">
            ยินดีต้อนรับ — เลือกเมนูด้านล่างเพื่อเริ่มจองได้เลย
          </p>
        </div>
      </section>

      <section className="px-4 mt-2 pb-24">
        <h3 className="text-pink-600 font-semibold mb-2">ตัวอย่างงาน</h3>
        <div className="grid grid-cols-3 gap-2">
          {["/work1.jpg","/work2.jpg","/work3.jpg","/idea1.jpg","/idea2.jpg"].slice(0,5).map((src,idx)=>(
            <img
              key={idx}
              src={src}
              alt="work example"
              className="w-full aspect-square object-cover rounded-2xl border border-pink-100 shadow-soft"
            />
          ))}
        </div>
      </section>
    </>
  );
}
