import { createPublicClient, http } from 'viem';
import * as chains from 'viem/chains';

export function getPublicClient(chainId: number) {
  return createPublicClient({
    chain: Object.values(chains).find((chain) => chain.id === chainId),
    transport: http(`${process.env.RPC_URL}?chainId=${chainId}&appId=twap-ui`),
  });
}
