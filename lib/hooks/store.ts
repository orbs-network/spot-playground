import { Step, SwapStatus } from "@orbs-network/swap-ui";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SwapStep } from "../types";
import { DEFAULT_PRICE_PROTECTION, DEFAULT_SLIPPAGE } from "../consts";

type UserStore = {
  slippage: number;
  setSlippage: (slippage: number) => void;
  priceProtection: number;
  setPriceProtection: (priceProtection: number) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      slippage: DEFAULT_SLIPPAGE,
      priceProtection: DEFAULT_PRICE_PROTECTION,
      setSlippage: (slippage: number) => set({ slippage }),
      setPriceProtection: (priceProtection: number) => set({ priceProtection }),
    }),
    {
      name: "swap-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

type SwapStore = {
  inputAmount: string;
  setInputAmount: (inputAmount: string) => void;
  pauseQuote: boolean;
  setPauseQuote: (pauseQuote: boolean) => void;
};

export const useSwapStore = create<SwapStore>((set) => ({
  inputAmount: "",
  setInputAmount: (inputAmount: string) => set({ inputAmount }),
  pauseQuote: false,
  setPauseQuote: (pauseQuote: boolean) => set({ pauseQuote }),
}));


type BestTradeSwapStore = {
  status?: SwapStatus;
  totalSteps?: number;
  currentStep?: SwapStep;
  currentStepIndex?: number;
  txHash?: string;
  updateStore: (data: Partial<BestTradeSwapStore>) => void;
  resetStore: () => void;
}

export const useBestTradeSwapStore = create<BestTradeSwapStore>((set) => ({
  updateStore: (data: Partial<BestTradeSwapStore>) => set((state) => ({ ...state, ...data })),
  resetStore: () => set({ status: undefined, totalSteps: undefined, currentStep: undefined, currentStepIndex: undefined, txHash: undefined }),
}));