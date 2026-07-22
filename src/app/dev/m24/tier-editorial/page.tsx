import { MockAppFrame } from "@/components/dev/m24/frame";
import { TierlistEditorial } from "@/components/dev/m24/tierlist-editorial";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <MockAppFrame sidebar={false}>
      <TierlistEditorial />
    </MockAppFrame>
  );
}
