import { DEFAULT_PRICE_PROTECTION, DEFAULT_SLIPPAGE } from "../consts";
import { useUserStore } from "./store";

export const useSettings = () => {
  const { slippage = DEFAULT_SLIPPAGE, setSlippage, priceProtection = DEFAULT_PRICE_PROTECTION, setPriceProtection } = useUserStore();
  return { slippage, setSlippage, priceProtection, setPriceProtection };
};