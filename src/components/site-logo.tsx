import Image from "next/image";

// ไอคอนโลโก้จริง — สลับสีตามธีมด้วย CSS ล้วน (.theme-logo-light/dark ใน globals.css)
// ป้องกัน ring สีกรมท่าของโลโก้จมหายบนพื้นมืด (contrast ~1:1) โดยใช้ไฟล์ dark variant แยก
export function SiteLogoIcon({ size = 28 }: { size?: number }) {
  const height = Math.round((size * 490) / 512);
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height }}>
      <Image
        src="/brand/icon.png"
        alt=""
        width={size}
        height={height}
        priority
        className="theme-logo-light absolute inset-0"
      />
      <Image
        src="/brand/icon-dark.png"
        alt=""
        width={size}
        height={height}
        priority
        className="theme-logo-dark absolute inset-0"
      />
    </span>
  );
}

export function SiteLogo({ iconSize = 28 }: { iconSize?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <SiteLogoIcon size={iconSize} />
      <span className="text-[17px] font-semibold tracking-tight text-foreground lowercase">
        carmeta
      </span>
    </span>
  );
}
