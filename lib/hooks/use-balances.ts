import { useQuery } from "@tanstack/react-query";
import { useConnection } from "wagmi";
import axios from "axios";
import { useMemo } from "react";
import { useFormatNumber, useToAmountUI } from "./common";
import { Currency } from "../types";
import { useCurrenciesQuery } from "./use-currencies-query";

export const useBalances = () => {
  const { chainId, address } = useConnection();
  const { data: currencies } = useCurrenciesQuery();
  const addresses = useMemo(() => currencies?.map((it) => it.address) ?? [], [currencies]);
  return useQuery<Record<string, string>>({
    queryKey: ["balances", chainId, address, addresses.join(",") ?? ""],
    queryFn: async () => {
      const response = await axios.post("/api/balances", {
        chainId,
        address,
        tokens: addresses,
      });
      
      return response.data;
    },
    enabled: !!chainId && !!address && !!addresses && addresses.length > 0,
    refetchInterval: 60_000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useBalance = (currency?: Currency) => {
  const { data: balances, isLoading } = useBalances();
  const balance = useMemo(() => {
    return balances?.[currency?.address ?? ""];
  }, [balances, currency]);

  const ui = useToAmountUI(currency?.decimals, balance)

  return {
    ui: useToAmountUI(currency?.decimals, balance),
    wei: balance,
    formatted: useFormatNumber({ value: ui }),
    isLoading,
  };
};
