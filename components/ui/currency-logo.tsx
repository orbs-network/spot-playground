import { Currency } from "@/lib/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn, getFirstAndLastLetter } from "@/lib/utils";

export function CurrencyLogo({ currency, className }: { currency?: Currency, className?: string }) {
  return (
    <Avatar className={cn("size-10", className)}>
      <AvatarImage src={currency?.logoUrl} alt={currency?.name} />
      <AvatarFallback className="bg-accent rounded-full text-xs w-full h-full flex items-center justify-center">{getFirstAndLastLetter(currency?.symbol ?? "")}</AvatarFallback>
    </Avatar>
  );
}
