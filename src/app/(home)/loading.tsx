export default function Loading() {
  return (
    <div aria-busy="true">
      <div className="flex flex-col items-center pt-24 pb-10">
        <div className="h-4 w-40 animate-pulse rounded bg-surface-muted" />
        <div className="mt-6 h-10 w-72 max-w-full animate-pulse rounded-lg bg-surface-muted" />
        <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-surface-muted" />
        <div className="mt-10 h-20 w-[28rem] max-w-full animate-pulse rounded-xl bg-surface-muted" />
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-surface-muted" />
      <span className="sr-only">กำลังโหลดข้อมูล…</span>
    </div>
  );
}
