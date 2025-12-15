"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormContainer } from "../form-container";
import {
  ButtonProps,
  Module,
  Partners,
  SelectMenuProps,
  Token,
  TWAP as Spot,
  useDstTokenPanel,
  useDurationPanel,
  useSrcTokenPanel,
  useTradesPanel,
  useTypedSrcAmount,
  DEFAULT_DURATION_OPTIONS,
  SelectMeuItem,
  useFillDelayPanel,
  useSubmitSwapPanel,
  Components,
  DISCLAIMER_URL,
  TooltipProps,
  useInputErrors,
  TokenLogoProps,
  useDisclaimerPanel,
  useLimitPricePanel,
  useTriggerPricePanel,
  useInvertTradePanel,
  useOrderHistoryPanel,
  OrderStatus,
} from "@orbs-network/twap-ui";
import { Currency, Field, SwapType } from "@/lib/types";
import { useDerivedSwap } from "@/lib/hooks/use-derived-swap";
import { Button } from "../ui/button";
import { CurrencyCard } from "../currency-card";
import { useActionHandlers } from "@/lib/hooks/use-action-handlers";
import { ToggleCurrencies } from "../toggle-currencies";
import { cn } from "@/lib/utils";
import { NumericInput } from "../ui/numeric-input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowLeftRightIcon,
  ChevronRightIcon,
  HistoryIcon,
  InfoIcon,
} from "lucide-react";
import * as chains from "viem/chains";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUSDPrice } from "@/lib/hooks/use-usd-price";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Switch } from "../ui/switch";
import { useConnection, useWalletClient } from "wagmi";
import { SubmitSwapButton } from "../submit-swap-button";
import { useBalance } from "@/lib/hooks/use-balances";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useFormatNumber } from "@/lib/hooks/common";
import { useSettings } from "@/lib/hooks/use-settings";
import { Portal } from "../ui/portal";
import { Spinner } from "../ui/spinner";
import { SpotHooks } from "./hooks";
import { useCurrency } from "@/lib/hooks/use-currencies";

const { useCallbacks } = SpotHooks;
const Context = createContext<{
  swapModule: Module;
}>({
  swapModule: Module.TWAP,
});

const useTwapContext = () => {
  return useContext(Context);
};

const usePraseTwapTokens = (currency?: Currency) => {
  return useMemo((): Token | undefined => {
    if (!currency) return undefined;

    return {
      address: currency.address,
      decimals: currency.decimals,
      symbol: currency.symbol,
      logoUrl: currency.logoUrl,
    };
  }, [currency]);
};

const useToken = (address?: string) => {
  const currency = useCurrency(address);

  return useMemo((): Token | undefined => {
    if (!currency) return undefined;

    return {
      address: currency.address,
      decimals: currency.decimals,
      symbol: currency.symbol,
      logoUrl: currency.logoUrl,
    };
  }, [currency]);
};

const Orders = () => {
  const {
    selectedOrder,
    onSelectStatus,
    statuses,
    selectedStatus,
    onHideSelectedOrder,
  } = useOrderHistoryPanel();
  const [open, setOpen] = useState(false);

  const menuItems = useMemo(() => {
    return statuses.map((status) => ({
      text: status.text,
      value: status.value || "all",
    }));
  }, [statuses]);

  const selectedItem = useMemo(() => {
    if (!selectedStatus || selectedStatus === "all") {
      return menuItems.find((item) => item.value === "all");
    }
    return menuItems.find((item) => item.value === selectedStatus);
  }, [menuItems, selectedStatus]);

  const _onSelectStatus = useCallback(
    (it: SelectMeuItem) => {
      onSelectStatus(
        it.value === "all" ? undefined : (it.value as OrderStatus)
      );
    },
    [onSelectStatus]
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="flex flex-row gap-3 items-center">
            {selectedOrder && (
              <Button
                variant="outline"
                size="icon"
                onClick={onHideSelectedOrder}
                className="p-1"
              >
                <ArrowLeftIcon className="size-4" />
              </Button>
            )}
            <DialogTitle>{selectedOrder?.title ?? "Orders"}</DialogTitle>
          </DialogHeader>
          {!selectedOrder && (
            <SelectMenu
              selected={selectedItem}
              items={menuItems}
              onSelect={_onSelectStatus}
            />
          )}
          <Components.Orders />
        </DialogContent>
      </Dialog>

      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            onClick={() => setOpen(true)}
            variant="outline"
            className="p-2"
          >
            <HistoryIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View your order history</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

const useMarketReferencePrice = () => {
  const { quote, isLoadingQuote } = useDerivedSwap();

  return useMemo(() => {
    return {
      value: quote?.outAmount,
      isLoading: isLoadingQuote,
    };
  }, [quote, isLoadingQuote]);
};
const TwapButton = (props: ButtonProps) => {
  return (
    <Button isLoading={props.loading} onClick={props.onClick}>
      {props.children}
    </Button>
  );
};

const TokenPanel = ({ isSrcToken }: { isSrcToken: boolean }) => {
  const { inputCurrency, outputCurrency, inputAmount, outputAmount } =
    useDerivedSwap();
  const { handleCurrencyChange } = useActionHandlers();
  const srcTokenPanel = useSrcTokenPanel();
  const dstTokenPanel = useDstTokenPanel();
  const tokenPanel = isSrcToken ? srcTokenPanel : dstTokenPanel;
  const onTokenChange = useCallback(
    (currency: string) => {
      if (isSrcToken) {
        handleCurrencyChange(currency, Field.INPUT);
      } else {
        handleCurrencyChange(currency, Field.OUTPUT);
      }
    },
    [handleCurrencyChange, isSrcToken]
  );

  const onAmountChange = useCallback(
    (amount: string) => {
      tokenPanel.onChange(amount);
    },
    [tokenPanel]
  );

  return (
    <CurrencyCard
      currency={isSrcToken ? inputCurrency : outputCurrency}
      onCurrencyChange={onTokenChange}
      onAmountChange={onAmountChange}
      amount={isSrcToken ? inputAmount : outputAmount}
      title={isSrcToken ? "From" : "To"}
      disabled={!isSrcToken}
      isLoading={tokenPanel.isLoading}
    />
  );
};

const Listener = () => {
  const { amount: srcAmount } = useTypedSrcAmount();
  const { setInputAmount } = useActionHandlers();

  useEffect(() => {
    setInputAmount(srcAmount ?? "");
  }, [srcAmount, setInputAmount]);

  return null;
};

const getModule = (swapType: SwapType) => {
  if (swapType === SwapType.TWAP) {
    return Module.TWAP;
  } else if (swapType === SwapType.LIMIT) {
    return Module.LIMIT;
  } else if (swapType === SwapType.STOP_LOSS) {
    return Module.STOP_LOSS;
  } else if (swapType === SwapType.TAKE_PROFIT) {
    return Module.TAKE_PROFIT;
  }
  return Module.TWAP;
};

const TwapTooltip = (props: TooltipProps) => {
  if (!props.tooltipText) {
    return null;
  }
  return (
    <Tooltip>
      <TooltipTrigger>
        {props.children || <InfoIcon className="size-4" />}
      </TooltipTrigger>
      <TooltipContent>{props.tooltipText}</TooltipContent>
    </Tooltip>
  );
};

const Label = ({ title, tooltip }: { title: string; tooltip?: string }) => {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-foreground/80 font-medium">{title}</p>
      {tooltip && <TwapTooltip tooltipText={tooltip} />}
    </div>
  );
};

const Card = ({
  children,
  title,
  className = "",
  tooltip,
  error,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  tooltip?: string;
  error?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 bg-card p-4 rounded-lg group relative border border-transparent",
        className,
        error ? "border-destructive/80" : ""
      )}
    >
      {title && <Label title={title} tooltip={tooltip} />}
      {children}
    </div>
  );
};

const Disclaimer = () => {
  const message = useDisclaimerPanel();

  if (!message) {
    return null;
  }

  return (
    <div className="text-sm bg-card p-2 rounded-md flex flex-row gap-2">
      <InfoIcon className="size-4 text-muted-foreground relative top-0.5" />
      <p className="text-sm text-foreground/70 flex-1">
        {message.text}{" "}
        <a
          href={message.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary"
        >
          Learn more
        </a>
      </p>
    </div>
  );
};

const TradesPanel = () => {
  const { totalTrades, onChange, label, tooltip, error } = useTradesPanel();
  return (
    <Card
      title={label}
      tooltip={tooltip}
      className="flex flex-col gap-2"
      error={Boolean(error)}
    >
      <div className="flex items-center gap-2">
        <NumericInput
          value={totalTrades ? totalTrades.toString() : ""}
          onChange={(it) => onChange(Number(it))}
        />
        <p className="text-sm text-muted-foreground">Trades</p>
      </div>
    </Card>
  );
};

const SelectMenu = (props: SelectMenuProps) => {
  const onValueChange = useCallback(
    (it: string) => {
      const selected = props.items.find((item) => item.value.toString() === it);
      if (selected) {
        props.onSelect(selected as SelectMeuItem);
      }
    },
    [props]
  );

  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={props.selected?.value.toString()}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={props.selected?.text} />
      </SelectTrigger>
      <SelectContent>
        {props.items.map((it) => (
          <SelectItem key={it.value} value={it.value.toString()}>
            {it.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const DurationPanel = () => {
  const { duration, onInputChange, onUnitSelect, label, tooltip } =
    useDurationPanel();
  return (
    <Card title={label} tooltip={tooltip} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <NumericInput
          value={duration.value ? duration.value.toString() : ""}
          onChange={(it) => onInputChange(it)}
        />
        <SelectMenu
          selected={DEFAULT_DURATION_OPTIONS.find(
            (it) => it.value === duration.unit
          )}
          items={DEFAULT_DURATION_OPTIONS}
          onSelect={(it) => onUnitSelect(it.value as number)}
        />
      </div>
    </Card>
  );
};

const FillDelayPanel = () => {
  const { fillDelay, onInputChange, onUnitSelect, label, tooltip } =
    useFillDelayPanel();
  return (
    <Card title={label} tooltip={tooltip} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <NumericInput
          value={fillDelay.value ? fillDelay.value.toString() : ""}
          onChange={(it) => onInputChange(it)}
        />
        <SelectMenu
          selected={DEFAULT_DURATION_OPTIONS.find(
            (it) => it.value === fillDelay.unit
          )}
          items={DEFAULT_DURATION_OPTIONS}
          onSelect={(it) => onUnitSelect(it.value as number)}
        />
      </div>
    </Card>
  );
};

const ModuleInputs = () => {
  const { swapModule } = useTwapContext();

  if (swapModule === Module.TWAP) {
    return (
      <>
        <TradesPanel />
        <FillDelayPanel />
      </>
    );
  }

  return <DurationPanel />;
};

const TokenLogo = ({ token }: TokenLogoProps) => {
  return (
    <Avatar className="size-10 twap-token-logo">
      <AvatarImage src={token?.logoUrl ?? ""} />
    </Avatar>
  );
};

const SubmitSwapError = ({
  code,
  onClose,
}: {
  message: string;
  code: number;
  onClose: () => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 bg-destructive/50 p-2 rounded-md">
        <AlertTriangleIcon className="size-4 text-foreground relative top-0.5" />
        <p className="text-sm text-foreground flex-1 font-medium">
          Error code: {code}
        </p>
      </div>
      <div className="w-full flex justify-center">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

const SubmitSwapMain = ({
  onSubmitOrder,
  swapLoading,
}: {
  onSubmitOrder: () => void;
  swapLoading: boolean;
}) => {
  const [disclaimerAccept, setDisclaimerAccept] = useState(true);

  return (
    <Components.SubmitOrderPanel
      reviewDetails={
        <>
          <div className="flex  gap-2 justify-between">
            <p className="text-sm">
              Accept{" "}
              <a
                href={DISCLAIMER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                Disclaimer
              </a>
            </p>
            <Switch
              checked={disclaimerAccept}
              onCheckedChange={setDisclaimerAccept}
            />
          </div>
          <Button
            disabled={!disclaimerAccept || swapLoading}
            onClick={onSubmitOrder}
            isLoading={swapLoading}
          >
            Create Order
          </Button>
        </>
      }
    />
  );
};

const SubmitSwap = () => {
  const {
    openSubmitModalButton,
    onSubmitOrder,
    onOpenModal,
    onCloseModal,
    swapLoading,
    error,
  } = useSubmitSwapPanel();
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    onOpenModal();
  }, [onOpenModal]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    onCloseModal();
  }, [onCloseModal]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <SubmitSwapButton
          disabled={openSubmitModalButton.disabled}
          text={openSubmitModalButton.text}
          isLoading={openSubmitModalButton.loading}
          onClick={onOpen}
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {error ? "Error Creating Order" : "Submit Swap"}
            </DialogTitle>
          </DialogHeader>
          {error ? (
            <SubmitSwapError
              message={error.message}
              code={error.code}
              onClose={onClose}
            />
          ) : (
            <SubmitSwapMain
              onSubmitOrder={onSubmitOrder}
              swapLoading={swapLoading ?? false}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const InputsErrorPanel = () => {
  const error = useInputErrors();

  if (!error) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2 bg-destructive/50 p-2 rounded-md">
      <AlertTriangleIcon className="size-4 text-foreground relative top-0.5" />
      <p className="text-sm text-foreground flex-1 font-medium">
        {error.message}
      </p>
    </div>
  );
};

const PriceInput = ({
  symbol,
  value,
  onChange,
  percentage,
  onPercentageChange,
  usd,
  isLoading
}: {
  symbol?: string;
  value: string;
  onChange: (value: string) => void;
  percentage: string;
  onPercentageChange: (value: string) => void;
  usd: string;
  isLoading?: boolean;
}) => {
  const usdF = useFormatNumber({ value: usd });
  return (
    <div className="flex flex-row gap-2 items-stretch">
      <div className="flex-1 flex justify-between bg-accent items-center px-3 py-2 rounded-[12px] gap-3">
        <p className="text-[15px] font-medium text-muted-foreground">
          {symbol}
        </p>
        <div className="flex-1 flex flex-col items-end">
          <NumericInput
            isLoading={isLoading}
            value={value}
            onChange={(it) => onChange(it)}
            className="flex-1 text-right text-[21px]"
          />
          <p className="text-[13px] text-muted-foreground">${usdF || "0"}</p>
        </div>
      </div>
      <div className="w-[100px] bg-accent items-center px-3 py-2 rounded-[12px]">
        <NumericInput
          value={percentage}
          onChange={(it) => onPercentageChange(it)}
          className="text-center text-[21px]"
          placeholder="0.0%"
          suffix="%"
          allowNegative={true}
        />
      </div>
    </div>
  );
};

const PriceResetButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="text-[14px] font-medium text-muted-foreground hover:text-primary cursor-pointer"
    >
      Set to default
    </button>
  );
};

const LimitPricePanel = () => {
  const {
    toToken,
    onChange,
    price,
    percentage,
    onPercentageChange,
    usd,
    isLimitPrice,
    toggleLimitPrice,
    label,
    tooltip,
    warning,
    onReset,
    isLoading
  } = useLimitPricePanel();

  const { swapModule } = useTwapContext();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {swapModule !== Module.LIMIT && (
          <Switch checked={isLimitPrice} onCheckedChange={toggleLimitPrice} />
        )}
        <div className="flex justify-between w-full items-center">
          <Label title={label} tooltip={tooltip} />
          {isLimitPrice && <PriceResetButton onClick={onReset} />}
        </div>
      </div>
      {isLimitPrice && (
        <PriceInput
          usd={usd}
          symbol={toToken?.symbol}
          value={price}
          onChange={(it) => onChange(it)}
          percentage={percentage}
          onPercentageChange={(it) => onPercentageChange(it)}
          isLoading={isLoading}
        />
      )}
      {warning && (
        <div className="text-sm text-foreground/80 flex items-start gap-2 bg-accent p-2 rounded-md">
          <AlertTriangleIcon className="size-4 relative top-0.5" />
          <p className="flex-1">
            {warning.text}{" "}
            <a
              href={warning.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              Learn more
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

const TriggerPricePanel = () => {
  const {
    price,
    onChange,
    percentage,
    onPercentageChange,
    usd,
    label,
    tooltip,
    onReset,
    toToken,
  } = useTriggerPricePanel();

  const { swapModule } = useTwapContext();

  if (swapModule !== Module.TAKE_PROFIT && swapModule !== Module.STOP_LOSS) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between w-full items-center">
        <Label title={label} tooltip={tooltip} />
        <PriceResetButton onClick={onReset} />
      </div>
      <PriceInput
        usd={usd}
        symbol={toToken?.symbol}
        value={price}
        onChange={(it) => onChange(it)}
        percentage={percentage}
        onPercentageChange={(it) => onPercentageChange(it)}
      />
    </div>
  );
};

const PricesHeader = () => {
  const { onInvert, isInverted, fromToken, isMarketPrice } =
    useInvertTradePanel();
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <p className="text-[15px] font-medium text-muted-foreground">
        {isInverted ? "Buy " : "Sell "}
        {fromToken?.symbol} {isMarketPrice ? "at best rate" : "at rate"}
      </p>

      {!isMarketPrice && (
        <Button
          variant="secondary"
          size="icon"
          onClick={onInvert}
          className="p-1"
        >
          <ArrowLeftRightIcon className="size-4" />
        </Button>
      )}
    </div>
  );
};

const Prices = () => {
  return (
    <Card className="flex flex-col gap-4">
      <PricesHeader />
      <TriggerPricePanel />
      <LimitPricePanel />
    </Card>
  );
};

const getPartner = (chainId?: number) => {
  if (!chainId) {
    return Partners.THENA;
  }
  switch (chainId) {
    case chains.base.id:
    case chains.polygon.id:
      return Partners.QUICKSWAP;
    case chains.bsc.id:
      return Partners.THENA;
    case chains.sonic.id:
      return Partners.SPOOKYSWAP;
    case chains.sei.id:
      return Partners.NAMI;
    case chains.linea.id:
      return Partners.LYNEX;
    default:
      return Partners.THENA;
  }
};

export function SpotForm({ swapType }: { swapType: SwapType }) {
  const { inputCurrency, outputCurrency } = useDerivedSwap();
  const { chainId, address } = useConnection();
  const { priceProtection } = useSettings();
  const swapModule = useMemo(() => getModule(swapType), [swapType]);
  const callbacks = useCallbacks();

  const inputUsd = useUSDPrice({
    token: inputCurrency?.address,
  });
  const outputUsd = useUSDPrice({
    token: outputCurrency?.address,
  });

  const { wei: inputBalance } = useBalance(inputCurrency);
  const { wei: outputBalance } = useBalance(outputCurrency);

  return (
    <Context.Provider value={{ swapModule }}>
      <FormContainer>
        <Spot
          chainId={chainId}
          provider={useWalletClient().data?.transport}
          account={address}
          partner={getPartner(chainId)}
          srcBalance={inputBalance}
          dstBalance={outputBalance}
          srcToken={usePraseTwapTokens(inputCurrency)}
          dstToken={usePraseTwapTokens(outputCurrency)}
          priceProtection={priceProtection}
          module={swapModule}
          srcUsd1Token={inputUsd.data.toString()}
          dstUsd1Token={outputUsd.data.toString()}
          marketReferencePrice={useMarketReferencePrice()}
          overrides={{
            minChunkSizeUsd: 5,
          }}
          useToken={useToken}
          components={{
            Button: TwapButton,
            Tooltip: TwapTooltip,
            TokenLogo,
            Spinner: <Spinner className="size-18" />,
          }}
          callbacks={callbacks}
        >
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-0">
              <TokenPanel isSrcToken={true} />
              <ToggleCurrencies />
              <TokenPanel isSrcToken={false} />
            </div>
            <Prices />
            <ModuleInputs />
            <InputsErrorPanel />
            <SubmitSwap />
            <Disclaimer />
          </div>
          <Portal containerId="spot-orders">
            <Orders />
          </Portal>
        </Spot>
        <Listener />
      </FormContainer>
    </Context.Provider>
  );
}

export const SpotOrders = () => {
  return <div id="spot-orders" className="w-full" />;
};
