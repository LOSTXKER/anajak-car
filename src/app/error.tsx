"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-medium tracking-[0.22em] text-faint uppercase">Error</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        โหลดข้อมูลไม่สำเร็จ
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        ระบบเชื่อมต่อฐานข้อมูลไม่ได้ชั่วคราว — ลองใหม่อีกครั้ง
        ถ้ายังไม่ได้ให้กลับมาใหม่ภายหลัง
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-faint">รหัสอ้างอิง: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
      >
        ลองใหม่
      </button>
    </div>
  );
}
