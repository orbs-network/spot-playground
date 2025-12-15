import { SwapType } from "../types";
import { useSwapStore } from "./store";
import { useSwapParams } from "./use-swap-params";
import { useCurrency } from "./use-currencies";
import { useFormatDecimals, useToAmountUI, useToAmountWei } from "./common";
import { useTrade } from "./use-trade";

export const useDerivedSwap = () => {
  const {
    inputCurrency: inputCurrencyAddress,
    outputCurrency: outputCurrencyAddress,
    swapType,
  } = useSwapParams();
  const store = useSwapStore();
  const inputCurrency = useCurrency(inputCurrencyAddress ?? undefined);
  const outputCurrency = useCurrency(outputCurrencyAddress ?? undefined);

  const parsedInputAmount = useToAmountWei(
    inputCurrency?.decimals,
    store.inputAmount
  );

  const {
    data: quote,
    isLoading: isLoadingQuote,
    refetch: refetchQuote,
  } = useTrade(inputCurrency, outputCurrency, parsedInputAmount);

  const outputAmount = useFormatDecimals(useToAmountUI(
    outputCurrency?.decimals,
    quote?.outAmount
  ));

  return {
    inputCurrency,
    outputCurrency,
    swapType: swapType as SwapType,
    inputAmount: store.inputAmount,
    parsedInputAmount,
    quote,
    isLoadingQuote,
    refetchQuote,
    outputAmount,
  };
};
