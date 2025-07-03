"use client"

import { memo } from "react"
import _ from "lodash"

import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { useCoingeckoCoin } from "@/hooks/use-coingecko-coin"

import { Skeleton } from "./ui/skeleton"

export const TokenDisplay = memo(
  ({
    coingeckoId,
    className,
    ...props
  }: {
    coingeckoId: string
    className?: string
  } & React.ComponentProps<"div">) => {
    const { data: coin } = useCoingeckoCoin(coingeckoId)

    return (
      <div
        className={cn(
          "mt-2 flex items-center gap-1 text-sm font-medium",
          className
        )}
        {...props}
      >
        {coin ? (
          <>
            <img src={coin.image} className="size-4 shrink-0 rounded-full" />
            <div className="font-semibold">{_.upperCase(coin.symbol)}</div>
            <div className="text-secondary-foreground ml-auto">
              $
              {formatter.numberReadable(coin.current_price, {
                mantissa: 4,
              })}
            </div>
            <div
              className={cn(
                "text-muted-foreground text-xs",
                coin.price_change_24h > 0 ? "text-green-400" : "text-red-400"
              )}
            >
              ({formatter.pct(coin.price_change_24h / 100)})
            </div>
          </>
        ) : (
          <>
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="ml-auto h-5 w-12" />
            <Skeleton className="h-4 w-8" />
          </>
        )}
      </div>
    )
  }
)

TokenDisplay.displayName = "TokenDisplay"
