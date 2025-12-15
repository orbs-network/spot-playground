import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Chain, defineChain } from "viem";
import {
  polygon,
  mainnet,
  arbitrum,
  bsc,
  fantom,
  blast,
  linea,
  sei,
  base,
  sonic,
  arbitrumNova,
  flare,
  cronoszkEVM,
  berachain,
} from "viem/chains";
import { useIsSpotTab } from "./hooks/use-tabs";
import { useMemo } from "react";

const katana: Chain = defineChain({
  id: 747474,
  name: "Katana",
  network: "katana",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.katana.network"],
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 7654707,
    },
  },
});

const MAIN_CONFIG = getDefaultConfig({
  pollingInterval: 60_0000,
  appName: "Playground",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains: [
    mainnet,
    arbitrum,
    bsc,
    linea,
    sei,
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