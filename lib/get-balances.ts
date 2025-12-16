/* eslint-disable @typescript-eslint/no-explicit-any */
import { erc20Abi, zeroAddress } from "viem";
import { getPublicClient } from "./get-public-client";
import { isNativeAddress } from "./utils";
import { Balances } from "./types";

export const getBalances = async (
  chainId: number,
  address: string,
  tokens: string[]
): Promise<Balances> => {
  const tokensWithoutNative = tokens.filter((token) => !isNativeAddress(token));
  try {
    const publicClient = getPublicClient(chainId);
    const balances = await publicClient.multicall({
      contracts: tokensWithoutNative.map((token) => ({
        address: token,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      })) as any[],
    });
    

    const nativeBalance = await publicClient.getBalance({
      address: address as `0x${string}`,
    });

    const result = tokensWithoutNative.reduce(
      (acc, token, index) => ({
        ...acc,
        [token]: balances[index]?.result?.toString() ?? "0",
      }),
      {} as Balances
    );

    return {
      ...result,
      [zeroAddress]: nativeBalance.toString(),
    };
  } catch (error) {
    console.error("Error fetching balances:", error);
    throw error;
  }
};
