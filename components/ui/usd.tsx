import { Skeleton } from "./skeleton";
import { useUSDPrice } from "@/lib/hooks/use-usd-price";

export const USD = ({
    address,
    amount,
  }: {
    address?: string;
    amount: string;
  }) => {
    const { formatted: usdPrice, isLoading } = useUSDPrice({
      token: address,
      amount: amount,
    });
  
    return (
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Skeleton className="h-4 w-[50px]" />
        ) : (
          <p className="text-sm text-muted-foreground">${usdPrice || "0"}</p>
        )}
      </div>
    );
  };
  