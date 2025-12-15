import { useQuery } from "@tanstack/react-query";
import { useLiquidityHub } from "./liquidity-hub";
import { Currency } from "../types";
import { useSettings } from "./use-settings";
import BN from "bignumber.js";
import { getWrappedNativeCurrency, isNativeAddress } from "../utils";
import { useConnection } from "wagmi";
import { useSwapStore } from "./store";

export const useTrade = (
  inputCurrency?: Currency,
  outputCurrency?: Currency,
  parsedInputAmount = ""
) => {
  const liquidityHub = useLiquidityHub();
  const { slippage } = useSettings();
  const { pauseQuote } = useSwapStore();
  const { chainId, address: account } = useConnection();
  const inputCurrencyAddress = inputCurrency?.address ?? "";
  const outputCurrencyAddress = outputCurrency?.address ?? "";
  return useQuery({
    queryKey: [
      "quote",
      inputCurrencyAddress,
      outputCurrencyAddress,
      parsedInputAmount,
      slippage,
    ],
    queryFn: async ({ signal }) => {
      const quote = await liquidityHub.getQuote({
        fromToken: isNativeAddress(inputCurrencyAddress)
          ? getWrappedNativeCurrency(chainId!).address
          : inputCurrencyAddress!,
        toToken: outputCurrencyAddress!,
        inAmount: parsedInputAmount,
        dexMinAmountOut: "-1",
        slippage: slippage,
        signal,
        account: account,
      });
      return quote;
    },
    refetchInterval: pauseQuote ? false : 10_000,
    refetchOnWindowFocus: false,
    enabled:
      !!inputCurrencyAddress &&
      !!outputCurrencyAddress &&
      BN(parsedInputAmount).gt(0) &&
      !!chainId,
  });
};
