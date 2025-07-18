"use client"

import React, { useMemo } from "react"
import _ from "lodash"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import { getColor } from "@/lib/color"
import { dayjs } from "@/lib/dayjs"
import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { OverallFdv } from "@/types"

import { InfoTooltip } from "../info-tooltp"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import { Separator } from "../ui/separator"

export function OverallFdvChart({
  fdvs,
  className,
  ...props
}: {
  fdvs: OverallFdv[]
} & React.ComponentProps<"div">) {
  const { config, protocols, firstFdv, lastFdv } = useMemo(() => {
    const protocols = _.chain(fdvs)
      .map((f) => _.keys(f.fdvs))
      .flatten()
      .uniq()
      .value()
    return {
      config: _.chain(protocols)
        .map((p) => [
          `fdvs.${p}`,
          {
            label: p,
            color: getColor(p).hex(),
          },
        ])
        .fromPairs()
        .value() satisfies ChartConfig,
      protocols,
      change: (() => {
        const lastFdv = _.last(fdvs)!
        const firstFdv = _.first(fdvs)!
        return (lastFdv.totalFdv - firstFdv.totalFdv) / firstFdv.totalFdv
      })(),
      firstFdv: _.first(fdvs)!,
      lastFdv: _.last(fdvs)!,
    }
  }, [fdvs])

  const { current, change24h } = useMemo(() => {
    const td = fdvs[fdvs.length - 1]
    const yd = fdvs[fdvs.length - 2]
    const change24h = (td.totalFdv - yd.totalFdv) / yd.totalFdv
    return {
      current: td.totalFdv,
      change24h,
    }
  }, [fdvs])

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
          <h1 className="text-xl font-semibold md:text-2xl">
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
        <div className="flex-1" />
      </div>
      <ChartContainer
        config={config}
        className="bg-background h-[120px] w-full rounded-md p-2 pb-0 shadow-xs"
      >
        <BarChart
          accessibilityLayer
          data={fdvs}
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
            domain={["dataMin", (dataMax: number) => dataMax * 1.2]}
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
                  const fdv = item.payload.totalFdv
                  return (
                    <div>
                      <Separator className="my-2" />
                      <div className="flex items-center gap-2">
                        <div className="text-secondary-foreground">Date</div>
                        <div className="ml-auto">{date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-secondary-foreground">Total</div>
                        <div className="ml-auto">
                          <span className="text-secondary-foreground">$</span>
                          {formatter.numberReadable(fdv)}
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
            }
          />
          {protocols.map((protocol) => (
            <Bar
              stackId="a"
              key={protocol}
              dataKey={`fdvs.${protocol}`}
              fill={getColor(protocol).hex()}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}
