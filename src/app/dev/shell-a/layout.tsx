import { MockShell } from "@/components/dev/mock-shell";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MockShell variant="a" basePath="/dev/shell-a">
      {children}
    </MockShell>
  );
}
