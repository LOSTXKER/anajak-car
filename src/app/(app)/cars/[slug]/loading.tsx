// skeleton เฉพาะคอลัมน์เนื้อหา (sidebar + navbar คงอยู่ระหว่าง stream)
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-hidden>
      <div className="h-4 w-56 animate-pulse rounded bg-surface-muted" />
      <div className="mt-8 h-10 w-72 animate-pulse rounded bg-surface-muted" />
      <div className="mt-10 h-px w-full bg-border" />
      <div className="mt-8 h-14 w-80 animate-pulse rounded bg-surface-muted" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full max-w-3xl animate-pulse rounded bg-surface-muted" />
        ))}
      </div>
    </div>
  );
}
