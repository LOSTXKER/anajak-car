"use client";

import { useSyncExternalStore } from "react";

type Mode = "system" | "light" | "dark";
const STORAGE_KEY = "carmeta-theme";
const ORDER: Mode[] = ["system", "light", "dark"];

const LABEL: Record<Mode, string> = {
  system: "ธีมตามระบบ",
  light: "ธีมสว่าง",
  dark: "ธีมมืด",
};

const listeners = new Set<() => void>();

function applyToDom(mode: Mode) {
  if (mode === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = mode;
  }
}

function subscribe(onChange: () => void) {
  // storage event = อีก tab เปลี่ยนธีม — ต้อง sync DOM ของ tab นี้ด้วย ไม่ใช่แค่ re-render ปุ่ม
  const onStorage = () => {
    applyToDom(getSnapshot());
    onChange();
  };
  listeners.add(onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Mode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return "system";
}

function getServerSnapshot(): Mode {
  return "system";
}

function setMode(mode: Mode) {
  applyToDom(mode);
  try {
    if (mode === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  } catch {}
  for (const notify of listeners) notify();
}

function Icon({ mode }: { mode: Mode }) {
  // เส้นบางตามธีม minimal — วาดเองเพื่อไม่เพิ่ม dependency
  if (mode === "light") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3" />
      </svg>
    );
  }
  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
      <rect x="3" y="4.5" width="18" height="12.5" rx="2" />
      <path d="M9 20.5h6M12 17v3.5" />
    </svg>
  );
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      title={LABEL[mode]}
      aria-label={`สลับธีม (ตอนนี้: ${LABEL[mode]})`}
      onClick={() => setMode(ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length])}
      className="inline-flex size-8 items-center justify-center rounded-full bg-surface-muted text-muted transition-colors hover:text-foreground"
    >
      <Icon mode={mode} />
    </button>
  );
}
