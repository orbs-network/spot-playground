import { useQuery } from "@tanstack/react-query";
import { useConnection } from "wagmi";
import { getCurrencies } from "../get-currencies";

export function useCurrenciesQuery() {
    const { chainId = 56 } = useConnection();
  
    return useQuery({
      queryKey: ["currencies", chainId],
      queryFn: async () => {
        try {
          const currencies = await getCurrencies(chainId!);
          return currencies;
        } catch (error) {
          console.error("Error fetching currencies:", error);
          throw error;
        }
      },
      staleTime: 1000 * 60 * 60 * 24,
    });
  }