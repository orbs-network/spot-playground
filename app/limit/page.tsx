"use client";

import { SpotForm } from "@/components/spot/spot-form";
import { SwapType } from "@/lib/types";

export default function LimitPage() {
  return (
    <SpotForm swapType={SwapType.LIMIT} />
  );
}
