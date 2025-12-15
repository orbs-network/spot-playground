import { SpotForm } from "@/components/spot/spot-form";
import { SwapType } from "@/lib/types";

export default function StopLossPage() {
    return <SpotForm swapType={SwapType.STOP_LOSS} />
  }
  