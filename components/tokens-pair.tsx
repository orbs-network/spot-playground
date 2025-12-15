import { filterCurrencies } from "@/lib/utils";
import React, { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "./ui/avatar";
import { useCurrencies } from "@/lib/hooks/use-currencies";

function TokensPair({
  srcTokenAddress = "",
  dstTokenAddress = "",
  prefix
}: {
  srcTokenAddress?: string;
  dstTokenAddress?: string;
  prefix?: string;
}) {
  const { currencies } = useCurrencies();
  const { srcToken: srcTokenData, dstToken: dstTokenData } = useMemo(() => {
    return {
      srcToken: filterCurrencies(currencies, [srcTokenAddress])[0],
      dstToken: filterCurrencies(currencies, [dstTokenAddress])[0],
    };
  }, [currencies, srcTokenAddress, dstTokenAddress]);
  return (
    <div className="flex items-center gap-2">
      {prefix && <p className="text-sm whitespace-nowrap font-medium">{prefix}</p>}
      <div className="flex items-center gap-1">
        <Avatar className="size-4">
          <AvatarImage src={srcTokenData?.logoUrl} />
        </Avatar>
        <p className="text-sm whitespace-nowrap font-medium">
          {srcTokenData?.symbol}
        </p>
      </div>
      <ChevronRight className="size-4" />
      <div className="flex items-center gap-1">
        <Avatar className="size-4">
          <AvatarImage src={dstTokenData?.logoUrl} />
        </Avatar>
        <p className="text-sm whitespace-nowrap font-medium">
          {dstTokenData?.symbol}
        </p>
      </div>
    </div>
  );
}

export default TokensPair;
