import { Currency } from "@/lib/types";
import { formatDecimals } from "@orbs-network/twap-ui";
import { Skeleton } from "./skeleton";
import BN from "bignumber.js";
import { useBalance } from "@/lib/hooks/use-balances";

export const Balance = ({
    currency,
    onAmountChange,
  }: {
    currency?: Currency;
    onAmountChange: (amount: string) => void;
  }) => {
    const { formatted, ui, isLoading } = useBalance(currency);
    return (
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => onAmountChange?.(formatDecimals(BN(ui).toString(), 8))}
      >
        {isLoading ? (
          <Skeleton className="h-4 w-[50px]" />
        ) : (
          <p className="text-[13px] text-muted-foreground font-medium">
            {formatted} {currency?.symbol}
          </p>
        )}
      </div>
    );
  };
  