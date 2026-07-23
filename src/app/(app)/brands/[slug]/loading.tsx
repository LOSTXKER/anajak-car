// skeleton เฉพาะคอลัมน์เนื้อหา (sidebar + navbar คงอยู่ระหว่าง stream)
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-hidden>
      <div className="h-4 w-40 animate-pulse rounded bg-surface-muted" />
      <div className="mt-6 h-10 w-64 animate-pulse rounded bg-surface-muted" />
      <div className="mt-8 h-px w-full bg-border" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded bg-surface-muted" />
        ))}
      </div>
    </div>
  );
}
