
export default function ReviewsPage(){
  return (
    <section className="px-4 mt-6 pb-24">
      <h2 className="text-pink-600 font-semibold mb-3">รีวิวลูกค้า</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {[1,2,3].map(i=>(
          <article key={i} className="rounded-3xl border border-pink-100 bg-pink-50/60 p-10 text-center text-pink-700 font-semibold">
            Work {i}
          </article>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">* ตัวอย่างหน้ารีวิว (placeholder)</p>
    </section>
  )
}
