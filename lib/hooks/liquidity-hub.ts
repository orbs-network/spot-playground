import { constructSDK } from "@orbs-network/liquidity-hub-sdk";
import { useConnection } from "wagmi";

export const useLiquidityHub = () => {
  const { chainId } = useConnection();
  return constructSDK({ chainId: chainId || 1, partner: "playground" });
};

