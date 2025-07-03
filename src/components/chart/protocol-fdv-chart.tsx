"use client"

import { useMemo } from "react"
import { Separator } from "@radix-ui/react-select"
import _ from "lodash"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

import { getColor } from "@/lib/color"
import { dayjs } from "@/lib/dayjs"
import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { CoinGeckoCoin, OverallFdv, ProtocolFdv } from "@/types"

import { InfoTooltip } from "../info-tooltp"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

export function ProtocolFdvChart({
  name,
  coin,
  fdv,
  className,
  ...props
}: {
  name: string
  coin: CoinGeckoCoin
  fdv: ProtocolFdv[]
} & React.ComponentProps<"div">) {
  const config = useMemo(
    () =>
      ({
        fdv: {
          label: "Fully Diluted Valuation",
          color: getColor(name).hex(),
        },
      }) satisfies ChartConfig,
    [name]
  )

  const { current, change24h } = useMemo(() => {
    const td = fdv[fdv.length - 1]
    const yd = fdv[fdv.length - 2]
    const change24h = (td.fdv - yd.fdv) / yd.fdv
    return {
      current: td.fdv,
      change24h,
    }
  }, [fdv])

  const { firstFdv, lastFdv } = useMemo(() => {
    const firstFdv = fdv[0]
    const lastFdv = fdv[fdv.length - 1]
    return {
      firstFdv,
      lastFdv,
    }
  }, [fdv])

  return (
    <div
      className={cn(
        "bg-card w-full space-y-2 rounded-md border p-2",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 p-1 pb-0">
        <div>
          <h2 className="text-secondary-foreground text-sm font-medium">
            Total FDV
            <InfoTooltip>
              Total Fully Diluted Valuation
              <div className="dark:text-secondary-foreground">
                The sum of all protocol&apos;s fully diluted valuations if they
                have a token.
              </div>
            </InfoTooltip>
          </h2>
          <h1 className="text-2xl font-semibold">
            <span className="text-secondary-foreground">$</span>
            {formatter.number(current)}{" "}
            <span
              className={cn(
                "text-muted-foreground text-base font-medium",
                change24h !== 0 &&
                  (change24h > 0 ? "text-green-400" : "text-red-400")
              )}
            >
              ({formatter.pct(change24h)})
            </span>
          </h1>
          <div className="text-muted-foreground -mt-0.5 inline-flex items-center text-xs">
            <p className="text-secondary-foreground">
              Data by{" "}
              <span className="font-semibold hover:underline">
                <a
                  href="https://www.coingecko.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Coingecko
                </a>
              </span>
            </p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b0/CoinGecko_logo.png"
              className="mx-1 size-4 shrink-0 rounded-full"
            />
            <p>
              {dayjs.utc(firstFdv.date * 1000).format("DD/MM/YYYY")} -{" "}
              {dayjs.utc(lastFdv.date * 1000).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>
      </div>
      <ChartContainer
        config={config}
        className="bg-background h-[210px] w-full rounded-md p-2 pb-0 shadow-xs"
      >
        <AreaChart
          accessibilityLayer
          data={fdv}
          margin={{
            top: 2,
            right: 0,
            bottom: -2,
            left: 0,
          }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={4}
            axisLine={false}
            fontSize={10}
            tickCount={7}
            tickFormatter={(unix) => dayjs.utc(unix * 1000).format("DD/MM")}
          />
          <YAxis
            hide
            domain={[(dataMin: number) => dataMin * 0.9, "dataMax"]}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                prefix="$"
                additionalLabel={(payload: any) => {
                  const item = payload[0]
                  if (!item?.payload) return null
                  const date = dayjs
                    .utc(item.payload.date * 1000)
                    .format("DD/MM HH:mm")
                  return (
                    <div>
                      <Separator className="my-2" />
                      <div className="flex items-center gap-2">
                        <div className="text-secondary-foreground">Date</div>
                        <div className="ml-auto">{date}</div>
                      </div>
                    </div>
                  )
                }}
              />
            }
          />
          <defs>
            <linearGradient id="fill-fdv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.fdv.color} stopOpacity={1} />
              <stop
                offset="100%"
                stopColor={config.fdv.color}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="fdv"
            type="monotone"
            stroke={config.fdv.color}
            fill="url(#fill-fdv)"
            fillOpacity={0.4}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
