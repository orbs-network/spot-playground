import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  polygon,
  mainnet,
  arbitrum,
  bsc,
  linea,
  sei,
  base,
  sonic,
} from "viem/chains";
import { useIsSpotTab } from "./hooks/use-tabs";
import { useMemo } from "react";

const MAIN_CONFIG = getDefaultConfig({
  pollingInterval: 60_0000,
  appName: "Playground",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains: [
    mainnet,
    arbitrum,
    bsc,
    linea,
    base,
    sonic,
    polygon,
  ],
});

const SPOT_CONFIG = getDefaultConfig({
  pollingInterval: 60_0000,
  appName: "Playground",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains: [
    bsc,
    linea,
    sei,
    base,
    sonic,
    polygon,
  ],
});



export const useWagmiConfig = () => {
  const isSpot = useIsSpotTab()

  return useMemo(() => {
    return isSpot ? SPOT_CONFIG : MAIN_CONFIG
  }, [isSpot])
}