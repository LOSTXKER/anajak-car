import { MockShell } from "@/components/dev/mock-shell";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MockShell variant="c" basePath="/dev/shell-c">
      {children}
    </MockShell>
  );
}
