import { SpotForm } from "@/components/spot/spot-form";
import { SwapType } from "@/lib/types";

export default function TakeProfitPage() {
    return <SpotForm swapType={SwapType.TAKE_PROFIT} />
  }
  