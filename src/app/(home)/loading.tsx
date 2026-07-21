export default function Loading() {
  return (
    <div aria-busy="true">
      <div className="flex flex-col items-center pt-20 pb-16 sm:pt-28">
        {/* h1 */}
        <div className="h-9 w-72 max-w-full animate-pulse rounded-lg bg-surface-muted sm:h-12 sm:w-[32rem]" />
        {/* ช่องค้นหา */}
        <div className="mt-10 h-14 w-full max-w-2xl animate-pulse rounded-full bg-surface-muted" />
        {/* ชิป */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-surface-muted" />
          ))}
        </div>
      </div>
      {/* แถวแบรนด์ (live ~3 ใบ + ดูเพิ่มเติม) */}
      <div className="flex flex-wrap justify-center gap-3 pb-16">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[104px] w-[108px] animate-pulse rounded-2xl bg-surface-muted" />
        ))}
      </div>
      <span className="sr-only">กำลังโหลดข้อมูล…</span>
    </div>
  );
}
